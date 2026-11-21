'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { getOrganizerStats } from '../_actions/analytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, TrendingDown, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateAnalyticsReport } from '@/lib/pdf-generator';

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
    eventCompletionRate: number;
    averageAttendanceRate: number;
    popularEventTimes: { time: string; count: number }[];
    ticketTypeDistribution: { type: string; count: number }[];
    refundRate: number;
    revenueByTicketType: { type: string; revenue: number }[];
    paymentMethodDistribution: { method: string; count: number }[];
    attendeeRetentionRate: number;
    firstTimeVsReturning: { type: string; count: number }[];
    registrationTimingDistribution: { timing: string; count: number }[];
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
      <Card className="overflow-hidden rounded-md border border-white/10 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-200">
            <Skeleton className="h-4 w-[100px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[160px]" />
          <Skeleton className="mt-4 h-4 w-[100px]" />
        </CardContent>
        <div className="" />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-md border border-white/10 bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-200">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight text-[#f4f5f7]">
          {value}
        </div>
        {change && (
          <p className="mt-2 flex items-center text-sm">
            {Number(change) > 0 ? (
              <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
            ) : (
              <TrendingDown className="mr-1 h-4 w-4 text-rose-500" />
            )}
            <span className={`${Number(change) > 0 ? "text-emerald-500" : "text-rose-500"} font-medium`}>
              {change}
            </span>
            {changeLabel && <span className="text-zinc-400 ml-1">{changeLabel}</span>}
          </p>
        )}
      </CardContent>
      <div className="" />
    </Card>
  );
}

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<StatsResponse['stats'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleGenerateReport = async () => {
    if (!stats) return;
    
    try {
      setGeneratingPdf(true);
      const doc = await generateAnalyticsReport(stats);
      doc.save('event-analytics-report.pdf');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setError('Failed to generate PDF report');
    } finally {
      setGeneratingPdf(false);
    }
  };

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
          totalEvents: Number(response.stats.totalEvents) || 0,
          totalTickets: Number(response.stats.totalTickets) || 0,
          totalRevenue: Number(response.stats.totalRevenue) || 0,
          averageRating: Number(response.stats.averageRating) || 0,
          totalReviews: Number(response.stats.totalReviews) || 0,
          newEvents: Number(response.stats.newEvents) || 0,
          recentRevenue: Number(response.stats.recentRevenue) || 0,
          ticketSalesGrowth: Number(response.stats.ticketSalesGrowth) || 0,
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
          })) || [],
          eventCompletionRate: Number(response.stats.eventCompletionRate) || 0,
          averageAttendanceRate: Number(response.stats.averageAttendanceRate) || 0,
          popularEventTimes: response.stats.popularEventTimes?.map(t => ({
            time: t.time || '',
            count: t.count || 0
          })) || [],
          ticketTypeDistribution: response.stats.ticketTypeDistribution?.map(t => ({
            type: t.type || '',
            count: t.count || 0
          })) || [],
          refundRate: Number(response.stats.refundRate) || 0,
          revenueByTicketType: response.stats.revenueByTicketType?.map(t => ({
            type: t.type || '',
            revenue: t.revenue || 0
          })) || [],
          paymentMethodDistribution: response.stats.paymentMethodDistribution?.map(t => ({
            method: t.method || '',
            count: t.count || 0
          })) || [],
          attendeeRetentionRate: Number(response.stats.attendeeRetentionRate) || 0,
          firstTimeVsReturning: response.stats.firstTimeVsReturning?.map(t => ({
            type: t.type || '',
            count: t.count || 0
          })) || [],
          registrationTimingDistribution: response.stats.registrationTimingDistribution?.map(t => ({
            timing: t.timing || '',
            count: t.count || 0
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
      <div className="flex justify-between items-center">
        <DashboardHeader
          heading="Analytics Dashboard"
          text="View detailed insights about your events and attendees"
        />
        <Button
          onClick={handleGenerateReport}
          disabled={loading || generatingPdf || !stats}
          className="flex items-center gap-2 rounded-md bg-p1 px-4 font-semibold text-[#05121a] hover:bg-[#7bf6ff] transition-colors"
        >
          <FileDown className="h-4 w-4" />
          {generatingPdf ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>
      
      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-primary/10 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Overview</TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Events</TabsTrigger>
              <TabsTrigger value="revenue" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Revenue</TabsTrigger>
              <TabsTrigger value="attendees" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Attendees</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Events"
                  value={String(stats?.totalEvents || 0)}
                  isLoading={loading}
                />
                <StatCard
                  title="Total Tickets"
                  value={String(stats?.totalTickets || 0)}
                  change={stats?.ticketSalesGrowth.toString() + "%"}
                  changeLabel="vs last month"
                  isLoading={loading}
                />
                <StatCard
                  title="Total Revenue"
                  value={formatCurrency(stats?.totalRevenue || 0)}
                  isLoading={loading}
                />
                <StatCard
                  title="Average Rating"
                  value={`${Number(stats?.averageRating || 0).toFixed(1)} ★`}
                  isLoading={loading}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden rounded-md border border-white/10 bg-card">
                  <CardHeader>
                    <CardTitle className="text-zinc-200">Revenue Trend</CardTitle>
                    <CardDescription className="text-zinc-400">Revenue over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats?.revenueData || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="date" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #334155",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#e2e8f0" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="url(#colorRevenue)"
                            strokeWidth={2}
                            dot={false}
                          />
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                  <div className="" />
                </Card>

                <Card className="overflow-hidden rounded-md border border-white/10 bg-card">
                  <CardHeader>
                    <CardTitle className="text-zinc-200">Tickets by Event</CardTitle>
                    <CardDescription className="text-zinc-400">Distribution of ticket sales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.ticketsByEvent || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="event" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #334155",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#e2e8f0" }}
                          />
                          <Bar dataKey="tickets" fill="url(#colorTickets)" />
                          <defs>
                            <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2}/>
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                  <div className="" />
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  title="Event Completion Rate"
                  value={`${(Number(stats?.eventCompletionRate || 0) * 100).toFixed(1)}%`}
                  isLoading={loading}
                />
                <StatCard
                  title="Average Attendance Rate"
                  value={`${(Number(stats?.averageAttendanceRate || 0) * 100).toFixed(1)}%`}
                  isLoading={loading}
                />
                <StatCard
                  title="Total Events"
                  value={String(stats?.totalEvents || 0)}
                  isLoading={loading}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden rounded-md border border-white/10 bg-card">
                  <CardHeader>
                    <CardTitle className="text-zinc-200">Popular Event Times</CardTitle>
                    <CardDescription className="text-zinc-400">Most common start times for events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.popularEventTimes || []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="time" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #334155",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#e2e8f0" }}
                          />
                          <Bar dataKey="count" fill="#6366f1" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                  <div className="" />
                </Card>

                <Card className="overflow-hidden rounded-md border border-white/10 bg-card">
                  <CardHeader>
                    <CardTitle className="text-zinc-200">Ticket Type Distribution</CardTitle>
                    <CardDescription className="text-zinc-400">Breakdown of tickets by type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats?.ticketTypeDistribution || []}
                            dataKey="count"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                          >
                            {stats?.ticketTypeDistribution?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#6366f1', '#a855f7', '#c7d2fe'][index % 3]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1e293b",
                              border: "1px solid #334155",
                              borderRadius: "8px",
                            }}
                            labelStyle={{ color: "#e2e8f0" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                  <div className="" />
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  title="Total Revenue"
                  value={formatCurrency(stats?.totalRevenue || 0)}
                  isLoading={loading}
                />
                <StatCard
                  title="Refund Rate"
                  value={`${((stats?.refundRate || 0) * 100).toFixed(1)}%`}
                  isLoading={loading}
                />
                <StatCard
                  title="Average Revenue per Event"
                  value={formatCurrency((stats?.totalRevenue || 0) / (stats?.totalEvents || 1))}
                  isLoading={loading}
                />
              </div>

              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue by Ticket Type</CardTitle>
                  <CardDescription>Revenue distribution across different ticket types</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats?.revenueByTicketType || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="type" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#e2e8f0" }}
                        />
                        <Bar dataKey="revenue" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Payment Method Distribution</CardTitle>
                  <CardDescription>Breakdown of payment methods used</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.paymentMethodDistribution || []}
                          dataKey="count"
                          nameKey="method"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                        >
                          {stats?.paymentMethodDistribution?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#6366f1', '#a855f7'][index % 2]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#e2e8f0" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendees" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  title="Total Attendees"
                  value={String(stats?.totalTickets || 0)}
                  isLoading={loading}
                />
                <StatCard
                  title="Retention Rate"
                  value={`${(Number(stats?.attendeeRetentionRate || 0) * 100).toFixed(1)}%`}
                  isLoading={loading}
                />
                <StatCard
                  title="Average Rating"
                  value={`${Number(stats?.averageRating || 0).toFixed(1)} ★`}
                  isLoading={loading}
                />
              </div>

              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>First-Time vs Returning Attendees</CardTitle>
                  <CardDescription>Distribution of new and returning attendees</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.firstTimeVsReturning || []}
                          dataKey="count"
                          nameKey="type"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                        >
                          <Cell fill="#6366f1" />
                          <Cell fill="#a855f7" />
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#e2e8f0" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Registration Timing</CardTitle>
                  <CardDescription>When attendees typically register for events</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats?.registrationTimingDistribution || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="timing" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "#e2e8f0" }}
                        />
                        <Line type="monotone" dataKey="count" stroke="#6366f1" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card> */}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </DashboardShell>
  );
}