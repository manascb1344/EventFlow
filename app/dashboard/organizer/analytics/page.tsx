'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart } from '@tremor/react';
import { formatCurrency } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { getOrganizerStats } from '../_actions/analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsResponse {
  success: true;
  stats: {
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
  };
}

function StatCard({
  title,
  value,
  change,
  changeLabel,
  isLoading,
}: {
  title: string;
  value: string;
  change?: string;
  changeLabel?: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-[100px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-[120px]" />
          <Skeleton className="mt-2 h-4 w-[100px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {Number(change) > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            {change} {changeLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<StatsResponse['stats'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        if (!session?.user?.id) return;
        
        const response = await getOrganizerStats(+session.user.id);
        if ('error' in response) {
          throw new Error(response.error);
        }
        
        // Ensure all numeric values are valid
        const sanitizedStats = {
          ...response.stats,
          totalEvents: response.stats.totalEvents || 0,
          totalTickets: response.stats.totalTickets || 0,
          totalRevenue: response.stats.totalRevenue || 0,
          averageRating: response.stats.averageRating || 0,
          totalReviews: response.stats.totalReviews || 0,
          newEvents: response.stats.newEvents || 0,
          recentRevenue: response.stats.recentRevenue || 0,
          ticketSalesGrowth: response.stats.ticketSalesGrowth || 0,
          revenueData: response.stats.revenueData?.map(d => ({
            date: d.date || '',
            revenue: d.revenue || 0
          })) || [],
          ticketsByEvent: response.stats.ticketsByEvent?.map(t => ({
            event: t.event || '',
            tickets: t.tickets || 0
          })) || [],
          ratingDistribution: response.stats.ratingDistribution?.map(r => ({
            rating: r.rating || 0,
            count: r.count || 0
          })) || []
        };
        
        setStats(sanitizedStats);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics data');
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [session?.user?.id]);

  if (error) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Analytics"
          text="View your event analytics and insights"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analytics"
        text="View your event analytics and insights"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          change={formatCurrency(stats?.recentRevenue ?? 0)}
          changeLabel="from last month"
          isLoading={loading}
        />
        
        <StatCard
          title="Total Events"
          value={stats?.totalEvents?.toString() ?? '0'}
          change={`+${stats?.newEvents ?? 0}`}
          changeLabel="new this month"
          isLoading={loading}
        />
        
        <StatCard
          title="Total Tickets"
          value={stats?.totalTickets?.toString() ?? '0'}
          change={`${stats?.ticketSalesGrowth ?? 0}%`}
          changeLabel="growth"
          isLoading={loading}
        />
        
        <StatCard
          title="Average Rating"
          value={`${Number(stats?.averageRating ?? 0).toFixed(1)}/5.0`}
          change={stats?.totalReviews?.toString() ?? '0'}
          changeLabel="total reviews"
          isLoading={loading}
        />
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Monthly revenue for the past 6 months</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <LineChart
                  data={stats?.revenueData ?? []}
                  index="date"
                  categories={["revenue"]}
                  colors={["blue"]}
                  valueFormatter={formatCurrency}
                  yAxisWidth={60}
                  showAnimation={true}
                  className="h-[350px]"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Sales by Event</CardTitle>
              <CardDescription>Top 10 events by ticket sales</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <BarChart
                  data={stats?.ticketsByEvent ?? []}
                  index="event"
                  categories={["tickets"]}
                  colors={["blue"]}
                  yAxisWidth={48}
                  showAnimation={true}
                  className="h-[350px]"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Distribution of event ratings</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <BarChart
                  data={stats?.ratingDistribution ?? []}
                  index="rating"
                  categories={["count"]}
                  colors={["blue"]}
                  yAxisWidth={48}
                  showAnimation={true}
                  className="h-[350px]"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
