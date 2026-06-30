"use client";

import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ArcElement,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { Badge, Card } from "@/components/ui";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

export function DashboardPreview() {
  return (
    <div className="absolute inset-x-4 bottom-4 grid gap-3 text-slate-950 md:grid-cols-[1fr_0.82fr]">
      <Card className="glass border-white/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">Occupancy</p>
            <p className="text-2xl font-black">87%</p>
          </div>
          <Badge className="bg-teal-50 text-teal-700">Live</Badge>
        </div>
        <div className="mt-2 h-28">
          <Line
            options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }}
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              datasets: [{ data: [72, 76, 79, 82, 86, 87], borderColor: "#0f766e", backgroundColor: "#99f6e4", tension: 0.4 }]
            }}
          />
        </div>
      </Card>
      <Card className="glass hidden border-white/40 p-4 md:block">
        <p className="text-xs font-semibold text-muted-foreground">Revenue split</p>
        <div className="mt-2 h-28">
          <Doughnut
            options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
            data={{
              labels: ["Paid", "Pending", "Overdue"],
              datasets: [{ data: [74, 18, 8], backgroundColor: ["#14b8a6", "#f59e0b", "#ef4444"], borderWidth: 0 }]
            }}
          />
        </div>
      </Card>
      <Card className="glass hidden border-white/40 p-4 md:col-span-2 md:block">
        <div className="h-24">
          <Bar
            options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { display: false } } }}
            data={{
              labels: ["Rooms", "Leaves", "Visitors", "Complaints", "Attendance"],
              datasets: [{ data: [120, 42, 64, 18, 96], backgroundColor: ["#0f766e", "#2563eb", "#7c3aed", "#f59e0b", "#22c55e"], borderRadius: 8 }]
            }}
          />
        </div>
      </Card>
    </div>
  );
}
