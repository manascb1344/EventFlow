'use server';

import { db } from "@/lib/db/drizzle";
import { events, tickets, payments, surveys, EventStatus, PaymentStatus, TicketStatus } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function getEventStats(eventId: number) {
  try {
    const [ticketStats, revenueStats, surveyStats] = await Promise.all([
      db.select({
        totalTickets: sql<number>`COUNT(*)`,
        confirmedTickets: sql<number>`SUM(CASE WHEN ${tickets.status} = ${TicketStatus.CONFIRMED} THEN 1 ELSE 0 END)`,
        usedTickets: sql<number>`SUM(CASE WHEN ${tickets.status} = ${TicketStatus.USED} THEN 1 ELSE 0 END)`,
        canceledTickets: sql<number>`SUM(CASE WHEN ${tickets.status} = ${TicketStatus.CANCELED} THEN 1 ELSE 0 END)`,
      })
        .from(tickets)
        .where(eq(tickets.eventId, eventId)),

      db.select({
        totalRevenue: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
        refundedAmount: sql<number>`COALESCE(SUM(CASE WHEN ${payments.paymentStatus} = ${PaymentStatus.REFUNDED} THEN ${payments.amount} ELSE 0 END), 0)`,
      })
        .from(payments)
        .innerJoin(tickets, eq(tickets.id, payments.ticketId))
        .where(eq(tickets.eventId, eventId)),

      db.select({
        averageRating: sql<number>`COALESCE(AVG(${surveys.rating}), 0)`,
        totalResponses: sql<number>`COUNT(*)`,
        averageSpeakerRating: sql<number>`COALESCE(AVG(${surveys.speakerRating}), 0)`,
        averageVenueRating: sql<number>`COALESCE(AVG(${surveys.venueRating}), 0)`,
        averageContentRating: sql<number>`COALESCE(AVG(${surveys.contentRating}), 0)`,
        recommendationRate: sql<number>`COALESCE(AVG(CASE WHEN ${surveys.wouldRecommend} THEN 1 ELSE 0 END), 0)`,
      })
        .from(surveys)
        .where(eq(surveys.eventId, eventId)),
    ]);

    console.log("Event stats fetched:", { ticketStats, revenueStats, surveyStats });

    return {
      success: true,
      stats: {
        tickets: ticketStats[0],
        revenue: revenueStats[0],
        surveys: surveyStats[0],
      },
    };
  } catch (error) {
    console.error("Error fetching event stats:", error);
    return { error: "Failed to fetch event statistics" };
  }
}

interface OrganizerStats {
  totalEvents: number;
  totalTickets: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  newEvents: number;
  recentRevenue: number;
  ticketSalesGrowth: number;
  revenueData: { date: string; revenue: number }[];
  ticketsByEvent: { event: string; tickets: number }[];
  ratingDistribution: { rating: number; count: number }[];
  eventCompletionRate: number;
  averageAttendanceRate: number;
  ticketTypeDistribution: { type: string; count: number }[];
  revenueByTicketType: { type: string; revenue: number }[];
  refundRate: number;
  paymentMethodDistribution: { method: string; count: number }[];
  monthlyRecurringRevenue: { month: string; revenue: number }[];
  attendeeRetentionRate: number;
  firstTimeVsReturning: { type: string; count: number }[];
  registrationTimingDistribution: { timing: string; count: number }[];
  popularEventTimes: { time: string; count: number }[];
}

export async function getOrganizerStats(organizerId: number): Promise<{ success: true; stats: OrganizerStats } | { error: string }> {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const previousMonth = new Date(lastMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const lastMonthStr = lastMonth.toISOString();
    const sixMonthsAgoStr = sixMonthsAgo.toISOString();
    const previousMonthStr = previousMonth.toISOString();

    console.log("Date ranges:", { lastMonthStr, sixMonthsAgoStr, previousMonthStr });

    const [basicStats, recentStats, revenueData, ticketsByEvent, ratingDistribution, salesGrowth, eventMetrics, ticketTypeStats, paymentStats, attendeeStats, timingStats] = await Promise.all([
      db.select({
        totalEvents: sql<number>`COUNT(DISTINCT ${events.id})`,
        totalTickets: sql<number>`COUNT(${tickets.id})`,
        totalRevenue: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
        averageRating: sql<number>`COALESCE(ROUND(AVG(${surveys.rating})::numeric, 1), 0)`,
        totalReviews: sql<number>`COUNT(${surveys.id})`,
      })
        .from(events)
        .leftJoin(tickets, eq(tickets.eventId, events.id))
        .leftJoin(payments, eq(payments.ticketId, tickets.id))
        .leftJoin(surveys, eq(surveys.eventId, events.id))
        .where(eq(events.organizerId, organizerId)),

      db.select({
        newEvents: sql<number>`COUNT(DISTINCT CASE WHEN ${events.createdAt} >= ${lastMonthStr} THEN ${events.id} END)`,
        recentRevenue: sql<number>`COALESCE(SUM(CASE WHEN ${payments.paymentDate} >= ${lastMonthStr} THEN ${payments.amount} ELSE 0 END), 0)`,
      })
        .from(events)
        .leftJoin(tickets, eq(tickets.eventId, events.id))
        .leftJoin(payments, eq(payments.ticketId, tickets.id))
        .where(eq(events.organizerId, organizerId)),

      db.select({
        date: sql<string>`TO_CHAR(DATE_TRUNC('month', ${payments.paymentDate}), 'YYYY-MM-DD')`,
        revenue: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
      })
        .from(payments)
        .innerJoin(tickets, eq(tickets.id, payments.ticketId))
        .innerJoin(events, eq(events.id, tickets.eventId))
        .where(and(eq(events.organizerId, organizerId), sql`${payments.paymentDate} >= ${sixMonthsAgoStr}`, eq(payments.paymentStatus, PaymentStatus.COMPLETED)))
        .groupBy(sql`DATE_TRUNC('month', ${payments.paymentDate})`)
        .orderBy(sql`DATE_TRUNC('month', ${payments.paymentDate})`),

      db.select({
        event: events.name,
        tickets: sql<number>`COUNT(${tickets.id})`,
      })
        .from(events)
        .leftJoin(tickets, eq(tickets.eventId, events.id))
        .where(eq(events.organizerId, organizerId))
        .groupBy(events.id, events.name)
        .orderBy(sql<number>`COUNT(${tickets.id}) DESC`)
        .limit(5),

      db.select({
        rating: surveys.rating,
        count: sql<number>`COUNT(*)`,
      })
        .from(surveys)
        .innerJoin(events, eq(events.id, surveys.eventId))
        .where(eq(events.organizerId, organizerId))
        .groupBy(surveys.rating)
        .orderBy(surveys.rating),

      db.select({
        currentMonthSales: sql<number>`COUNT(CASE WHEN ${tickets.purchaseDate} >= ${lastMonthStr} THEN 1 END)`,
        previousMonthSales: sql<number>`COUNT(CASE WHEN ${tickets.purchaseDate} >= ${previousMonthStr} AND ${tickets.purchaseDate} < ${lastMonthStr} THEN 1 END)`,
      })
        .from(tickets)
        .innerJoin(events, eq(events.id, tickets.eventId))
        .where(eq(events.organizerId, organizerId)),

      db.select({
        totalEvents: sql<number>`COUNT(*)`,
        completedEvents: sql<number>`SUM(CASE WHEN ${events.eventStatus} = ${EventStatus.COMPLETED} THEN 1 ELSE 0 END)`,
        totalAttendance: sql<number>`SUM(CASE WHEN ${tickets.status} = ${TicketStatus.USED} THEN 1 ELSE 0 END)`,
      })
        .from(events)
        .leftJoin(tickets, eq(events.id, tickets.eventId))
        .where(eq(events.organizerId, organizerId)),

      db.select({
        ticketType: tickets.ticketType,
        count: sql<number>`COUNT(*)`,
        revenue: sql<number>`COALESCE(SUM(${payments.amount}), 0)`,
      })
        .from(tickets)
        .leftJoin(payments, eq(tickets.id, payments.ticketId))
        .innerJoin(events, eq(tickets.eventId, events.id))
        .where(eq(events.organizerId, organizerId))
        .groupBy(tickets.ticketType),

      db.select({
        totalPayments: sql<number>`COUNT(*)`,
        refundedPayments: sql<number>`SUM(CASE WHEN ${payments.paymentStatus} = ${PaymentStatus.REFUNDED} THEN 1 ELSE 0 END)`,
        paymentMethod: payments.paymentMethod,
      })
        .from(payments)
        .innerJoin(tickets, eq(payments.ticketId, tickets.id))
        .innerJoin(events, eq(tickets.eventId, events.id))
        .where(eq(events.organizerId, organizerId))
        .groupBy(payments.paymentMethod),

      db.select({
        attendeeId: tickets.attendeeId,
        purchaseCount: sql<number>`COUNT(*)`,
      })
        .from(tickets)
        .innerJoin(events, eq(tickets.eventId, events.id))
        .where(eq(events.organizerId, organizerId))
        .groupBy(tickets.attendeeId),

      db.select({
        hour: sql<string>`EXTRACT(HOUR FROM ${events.startDate})::text`,
        count: sql<number>`COUNT(*)`,
      })
        .from(events)
        .where(eq(events.organizerId, organizerId))
        .groupBy(sql`EXTRACT(HOUR FROM ${events.startDate})`)
        .orderBy(sql`COUNT(*) DESC`)
        .limit(10),
    ]);

    console.log("Query results:", { basicStats, recentStats, revenueData, ticketsByEvent, ratingDistribution, salesGrowth, eventMetrics, ticketTypeStats, paymentStats, attendeeStats, timingStats });

    const ticketSalesGrowth = salesGrowth[0].previousMonthSales === 0 
      ? 100 
      : Math.round(((salesGrowth[0].currentMonthSales - salesGrowth[0].previousMonthSales) / salesGrowth[0].previousMonthSales) * 100);

    const eventCompletionRate = eventMetrics[0].completedEvents / eventMetrics[0].totalEvents;
    const averageAttendanceRate = eventMetrics[0].totalAttendance / eventMetrics[0].totalEvents;
    
    const ticketTypeDistribution = ticketTypeStats.map(stat => ({
      type: stat.ticketType,
      count: Number(stat.count),
    }));

    const revenueByTicketType = ticketTypeStats.map(stat => ({
      type: stat.ticketType,
      revenue: Number(stat.revenue),
    }));

    const refundRate = paymentStats.reduce((acc, stat) => 
      acc + Number(stat.refundedPayments), 0) / paymentStats.reduce((acc, stat) => 
      acc + Number(stat.totalPayments), 0);

    const paymentMethodDistribution = paymentStats.map(stat => ({
      method: stat.paymentMethod,
      count: Number(stat.totalPayments),
    }));

    const attendeeRetentionRate = attendeeStats.filter(stat => 
      Number(stat.purchaseCount) > 1).length / attendeeStats.length;

    const firstTimeVsReturning = [
      { type: 'First Time', count: attendeeStats.filter(stat => Number(stat.purchaseCount) === 1).length },
      { type: 'Returning', count: attendeeStats.filter(stat => Number(stat.purchaseCount) > 1).length },
    ];

    const popularEventTimes = timingStats.map(stat => ({
      time: `${stat.hour}:00`,
      count: Number(stat.count),
    }));

    return {
      success: true,
      stats: {
        ...basicStats[0],
        ...recentStats[0],
        ticketSalesGrowth,
        revenueData,
        ticketsByEvent,
        ratingDistribution,
        eventCompletionRate,
        averageAttendanceRate,
        ticketTypeDistribution,
        revenueByTicketType,
        refundRate,
        paymentMethodDistribution,
        attendeeRetentionRate,
        firstTimeVsReturning,
        popularEventTimes,
        monthlyRecurringRevenue: (revenueData as Array<{ date: string; revenue: number }>).map((row) => ({ month: row.date, revenue: row.revenue })),
        registrationTimingDistribution: (ticketsByEvent as Array<{ event: string; tickets: number }>).map((row) => ({ timing: row.event, count: row.tickets })),
      },
    };
  } catch (error) {
    console.error("Error fetching organizer stats:", error);
    return { error: error instanceof Error ? error.message : 'Failed to fetch organizer stats' };
  }
}
