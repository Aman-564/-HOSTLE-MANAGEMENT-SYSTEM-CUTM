"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  DoorOpen,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  QrCode,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
  Utensils,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { api, clearSession, getStoredUser } from "@/lib/api";
import { Badge, Button, Card, cn } from "@/components/ui";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip);

const today = new Date().toISOString().slice(0, 10);
const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

const fallback = {
  summary: { students: 42, rooms: 18, payments: 12, complaintsOpen: 4, pendingLeaves: 7, capacity: 62, occupied: 51, occupancyRate: 82 },
  rooms: [
    { id: 1, roomNumber: "A-101", roomType: "SINGLE", capacity: 1, currentOccupancy: 0, price: 22000, floor: "1", amenities: "AC, WiFi, Attached Bath", status: "AVAILABLE" },
    { id: 2, roomNumber: "A-204", roomType: "DOUBLE", capacity: 2, currentOccupancy: 1, price: 14500, floor: "2", amenities: "Non-AC, WiFi, Balcony", status: "AVAILABLE" },
    { id: 3, roomNumber: "B-312", roomType: "TRIPLE", capacity: 3, currentOccupancy: 2, price: 12500, floor: "3", amenities: "AC, Near Mess, Lift", status: "AVAILABLE" },
    { id: 4, roomNumber: "C-118", roomType: "DOUBLE", capacity: 2, currentOccupancy: 2, price: 18000, floor: "1", amenities: "AC, Study Desk", status: "FULL" }
  ],
  students: [
    { id: 1, name: "Aisha Rao", email: "student@hostelos.test", phone: "+919999999999", address: "B Block, Campus Road", university: "National Institute", emergencyContact: "Ravi Rao", emergencyPhone: "+918888888888", status: "ACTIVE" },
    { id: 2, name: "Kabir Sen", email: "kabir@hostelos.test", phone: "+917777777777", address: "A Block, Campus Road", university: "National Institute", emergencyContact: "Meera Sen", emergencyPhone: "+916666666666", status: "ACTIVE" }
  ],
  bookings: [
    { id: 1, student: { id: 1, name: "Aisha Rao" }, room: { id: 3, roomNumber: "B-312" }, checkInDate: today, checkOutDate: "", status: "ACTIVE", totalAmount: 12500, paymentStatus: "PARTIAL" }
  ],
  payments: [
    { id: 1, booking: { id: 1, student: { name: "Aisha Rao" }, room: { roomNumber: "B-312" } }, amount: 8000, paymentDate: today, paymentMethod: "UPI", transactionId: "UPI-1042", status: "SUCCESS", remarks: "First installment" }
  ],
  complaints: [
    { id: 1, studentName: "Aisha Rao", title: "Wi-Fi weak near B Block study lounge", description: "Signal drops during evening study hours.", category: "MAINTENANCE", priority: "HIGH", status: "OPEN", assignedTo: "Mr. Kapoor" },
    { id: 2, studentName: "Kabir Sen", title: "Laundry refund pending", description: "Machine stopped mid-cycle.", category: "SERVICE", priority: "MEDIUM", status: "ASSIGNED", assignedTo: "Front desk" }
  ],
  leaves: [{ id: 1, studentName: "Aisha Rao", fromDate: today, toDate: today, reason: "Family function", status: "PENDING", approvedBy: "" }],
  visitors: [{ id: 1, studentName: "Aisha Rao", visitorName: "Ravi Rao", phone: "+918888888888", relation: "Father", purpose: "Weekend visit", checkIn: nowLocal, checkOut: "", status: "REQUESTED" }],
  attendance: [{ id: 1, studentName: "Aisha Rao", attendanceDate: today, status: "PRESENT", method: "QR" }],
  notices: [{ id: 1, title: "Fee window closes soon", body: "Semester hostel fee window closes on 28 June.", audience: "ALL", priority: "IMPORTANT" }],
  messMenu: [{ id: 1, dayName: "Monday", breakfast: "Idli, sambar, fruit", lunch: "Rice, dal, paneer, salad", snacks: "Tea, poha", dinner: "Roti, mixed veg, curd", calories: 2200 }],
  securityLogs: [{ id: 1, logType: "ENTRY", studentName: "Aisha Rao", message: "QR entry recorded at main gate", severity: "LOW", recordedAt: nowLocal }]
};

const modules = [
  { id: "overview", label: "Overview", icon: Home, roles: ["admin", "warden", "student"] },
  { id: "rooms", label: "Rooms", icon: DoorOpen, roles: ["admin", "warden", "student"] },
  { id: "students", label: "Students", icon: Users, roles: ["admin", "warden"] },
  { id: "bookings", label: "Bookings", icon: BookOpen, roles: ["admin", "warden"] },
  { id: "payments", label: "Fees", icon: CreditCard, roles: ["admin", "warden", "student"] },
  { id: "complaints", label: "Complaints", icon: MessageSquare, roles: ["admin", "warden", "student"] },
  { id: "leave", label: "Leave", icon: CalendarCheck, roles: ["admin", "warden", "student"] },
  { id: "visitors", label: "Visitors", icon: UserPlus, roles: ["admin", "warden", "student"] },
  { id: "attendance", label: "Attendance", icon: QrCode, roles: ["admin", "warden", "student"] },
  { id: "mess", label: "Mess", icon: Utensils, roles: ["admin", "warden", "student"] },
  { id: "notices", label: "Notices", icon: Bell, roles: ["admin", "warden", "student"] },
  { id: "security", label: "Security", icon: Shield, roles: ["admin", "warden"] }
];

const endpoints = {
  rooms: "/rooms",
  students: "/students",
  bookings: "/bookings",
  payments: "/payments",
  complaints: "/complaints",
  leaves: "/leave-requests",
  visitors: "/visitors",
  attendance: "/attendance",
  notices: "/notices",
  messMenu: "/mess-menu",
  securityLogs: "/security-logs"
};

const emptyForms = {
  rooms: { roomNumber: "", roomType: "SINGLE", capacity: 1, currentOccupancy: 0, price: 0, floor: "1", amenities: "", status: "AVAILABLE" },
  students: { name: "", email: "", phone: "", address: "", university: "", emergencyContact: "", emergencyPhone: "", status: "ACTIVE" },
  bookings: { studentId: "", roomId: "", checkInDate: today, checkOutDate: "", status: "ACTIVE", totalAmount: 0, paymentStatus: "PENDING" },
  payments: { bookingId: "", amount: 0, paymentDate: today, paymentMethod: "UPI", transactionId: "", status: "SUCCESS", remarks: "" },
  complaints: { studentName: "", title: "", description: "", category: "MAINTENANCE", priority: "MEDIUM", status: "OPEN", assignedTo: "" },
  leaves: { studentName: "", fromDate: today, toDate: today, reason: "", status: "PENDING", approvedBy: "" },
  visitors: { studentName: "", visitorName: "", phone: "", relation: "", purpose: "", checkIn: nowLocal, checkOut: "", status: "REQUESTED" },
  attendance: { studentName: "", attendanceDate: today, status: "PRESENT", method: "QR" },
  notices: { title: "", body: "", audience: "ALL", priority: "NORMAL" },
  messMenu: { dayName: "Monday", breakfast: "", lunch: "", snacks: "", dinner: "", calories: 2200 },
  securityLogs: { logType: "ENTRY", studentName: "", message: "", severity: "LOW", recordedAt: nowLocal }
};

const fieldLabels = {
  roomNumber: "Room number",
  roomType: "Room type",
  currentOccupancy: "Occupied",
  emergencyContact: "Emergency contact",
  emergencyPhone: "Emergency phone",
  studentId: "Student",
  roomId: "Room",
  checkInDate: "Check-in date",
  checkOutDate: "Check-out date",
  totalAmount: "Total amount",
  paymentStatus: "Payment status",
  bookingId: "Booking",
  paymentDate: "Payment date",
  paymentMethod: "Payment method",
  transactionId: "Transaction ID",
  studentName: "Student name",
  assignedTo: "Assigned to",
  fromDate: "From date",
  toDate: "To date",
  visitorName: "Visitor name",
  checkIn: "Check-in",
  checkOut: "Check-out",
  attendanceDate: "Date",
  dayName: "Day",
  logType: "Log type",
  recordedAt: "Recorded at"
};

export function OperationsDashboard({ role: rawRole }) {
  const role = String(rawRole || "admin").toLowerCase();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(null);
  const [query, setQuery] = useState("");
  const [data, setData] = useState(fallback);

  const visibleModules = useMemo(() => modules.filter((module) => module.roles.includes(role)), [role]);
  const isAdmin = role === "admin";
  const canOperate = role === "admin" || role === "warden";

  useEffect(() => {
    setUser(getStoredUser() || { name: "Demo User", role });
  }, [role]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const requests = [
          api.get("/analytics/summary"),
          ...Object.entries(endpoints).map(([key, endpoint]) => api.get(endpoint).then((response) => [key, response.data]))
        ];
        const [summaryResponse, ...collections] = await Promise.all(requests);
        if (!ignore) {
          setData((current) => ({ ...current, summary: summaryResponse.data, ...Object.fromEntries(collections) }));
          setMessage("Live backend connected");
        }
      } catch {
        if (!ignore) setMessage("Using demo data because the backend is not reachable");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  function logout() {
    clearSession();
    router.push("/");
  }

  function openCreate(moduleId) {
    setModal({ moduleId, title: `Add ${moduleTitle(moduleId)}`, record: { ...emptyForms[moduleId] } });
  }

  function openEdit(moduleId, record) {
    setModal({ moduleId, title: `Edit ${moduleTitle(moduleId)}`, record: toFormRecord(moduleId, record) });
  }

  function updateModal(field, value) {
    setModal((current) => ({ ...current, record: { ...current.record, [field]: value } }));
  }

  async function saveModal(event) {
    event.preventDefault();
    const { moduleId, record } = modal;
    const payload = toPayload(moduleId, record);
    const existingId = record.id;
    try {
      const response = existingId ? await api.put(`${endpoints[moduleId]}/${existingId}`, payload) : await api.post(endpoints[moduleId], payload);
      const saved = response.data || payload;
      setData((current) => ({
        ...current,
        [moduleId]: existingId ? current[moduleId].map((item) => (item.id === existingId ? saved : item)) : [{ ...saved, id: saved.id || Date.now() }, ...current[moduleId]]
      }));
      setMessage(`${moduleTitle(moduleId)} saved`);
    } catch {
      setData((current) => ({
        ...current,
        [moduleId]: existingId ? current[moduleId].map((item) => (item.id === existingId ? { ...payload, id: existingId } : item)) : [{ ...payload, id: Date.now() }, ...current[moduleId]]
      }));
      setMessage(`${moduleTitle(moduleId)} saved locally`);
    }
    setModal(null);
  }

  async function removeRecord(moduleId, id) {
    try {
      await api.delete(`${endpoints[moduleId]}/${id}`);
      setMessage(`${moduleTitle(moduleId)} deleted`);
    } catch {
      setMessage(`${moduleTitle(moduleId)} removed locally`);
    }
    setData((current) => ({ ...current, [moduleId]: current[moduleId].filter((item) => item.id !== id) }));
  }

  async function patchRecord(moduleId, record, patch) {
    const updated = { ...record, ...patch };
    try {
      const response = await api.put(`${endpoints[moduleId]}/${record.id}`, updated);
      setData((current) => ({ ...current, [moduleId]: current[moduleId].map((item) => (item.id === record.id ? response.data : item)) }));
    } catch {
      setData((current) => ({ ...current, [moduleId]: current[moduleId].map((item) => (item.id === record.id ? updated : item)) }));
    }
  }

  async function bookingAction(booking, action) {
    try {
      await api.post(`/bookings/${booking.id}/${action}`);
    } catch {
      setMessage("Booking updated locally");
    }
    setData((current) => ({
      ...current,
      bookings: current.bookings.map((item) => (item.id === booking.id ? { ...item, status: action === "checkout" ? "COMPLETED" : "CANCELLED" } : item))
    }));
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r bg-card/95 p-4 backdrop-blur lg:block">
        <Brand />
        <div className="space-y-1">
          {visibleModules.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveModule(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground",
                activeModule === id && "bg-muted text-foreground"
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
        <Card className="mt-6 p-4">
          <p className="text-sm font-bold">System status</p>
          <p className="mt-1 text-xs text-muted-foreground">{message || "Checking backend..."}</p>
        </Card>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></Button>
            <div>
              <p className="text-sm text-muted-foreground">Good evening, {user?.name || "Operator"}</p>
              <h1 className="text-xl font-black capitalize sm:text-2xl">{role} operations console</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm sm:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-44 bg-transparent outline-none" placeholder="Search records" />
            </div>
            <Badge className={loading ? "text-amber-700" : "text-teal-700"}>{loading ? "Syncing" : "Ready"}</Badge>
            <Button variant="dark" onClick={logout}><LogOut className="h-4 w-4" /> Logout</Button>
          </div>
        </header>

        <div className="space-y-6 p-4 sm:p-6">
          {activeModule === "overview" && <Overview data={data} setActiveModule={setActiveModule} />}
          {activeModule === "rooms" && <Rooms data={data} query={query} canEdit={isAdmin} openCreate={openCreate} openEdit={openEdit} removeRecord={removeRecord} />}
          {activeModule === "students" && <Students data={data} query={query} canEdit={isAdmin} openCreate={openCreate} openEdit={openEdit} removeRecord={removeRecord} />}
          {activeModule === "bookings" && <Bookings data={data} query={query} canEdit={isAdmin} openCreate={openCreate} openEdit={openEdit} bookingAction={bookingAction} />}
          {activeModule === "payments" && <Payments data={data} query={query} canEdit={isAdmin} openCreate={openCreate} openEdit={openEdit} />}
          {activeModule === "complaints" && <Complaints data={data} query={query} canEdit={canOperate} role={role} openCreate={openCreate} openEdit={openEdit} patchRecord={patchRecord} />}
          {activeModule === "leave" && <LeaveRequests data={data} query={query} canEdit={canOperate} openCreate={openCreate} openEdit={openEdit} patchRecord={patchRecord} />}
          {activeModule === "visitors" && <Visitors data={data} query={query} canEdit={canOperate} openCreate={openCreate} openEdit={openEdit} />}
          {activeModule === "attendance" && <Attendance data={data} query={query} canEdit={canOperate} openCreate={openCreate} openEdit={openEdit} />}
          {activeModule === "mess" && <Mess data={data} query={query} canEdit={canOperate} openCreate={openCreate} openEdit={openEdit} />}
          {activeModule === "notices" && <Notices data={data} query={query} canEdit={canOperate} openCreate={openCreate} openEdit={openEdit} />}
          {activeModule === "security" && <Security data={data} query={query} canEdit={canOperate} openCreate={openCreate} openEdit={openEdit} />}
        </div>
      </main>

      {modal && <RecordModal modal={modal} data={data} onClose={() => setModal(null)} onChange={updateModal} onSubmit={saveModal} />}
    </div>
  );
}

function Brand() {
  return (
    <div className="mb-8 flex items-center gap-3 px-2">
      <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
        <Shield className="h-5 w-5" />
      </div>
      <div>
        <p className="font-black">HostelOS</p>
        <p className="text-xs text-muted-foreground">Production console</p>
      </div>
    </div>
  );
}

function Overview({ data, setActiveModule }) {
  const cards = [
    ["Students", data.summary.students, "Registered residents", Users, "students"],
    ["Rooms", data.summary.rooms, `${data.summary.occupied}/${data.summary.capacity} beds occupied`, DoorOpen, "rooms"],
    ["Payments", data.summary.payments, "Receipts recorded", CreditCard, "payments"],
    ["Open issues", data.summary.complaintsOpen, `${data.summary.pendingLeaves} leaves pending`, AlertTriangle, "complaints"]
  ];
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, meta, Icon, moduleId]) => (
          <button key={label} type="button" onClick={() => setActiveModule(moduleId)} className="text-left">
            <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{label}</p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{meta}</p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-200">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </button>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black">Operations analytics</h2>
              <p className="text-sm text-muted-foreground">Occupancy, collections, complaints, and leave queues.</p>
            </div>
            <Badge>Live ready</Badge>
          </div>
          <div className="h-72">
            <Bar
              options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } } } }}
              data={{
                labels: ["Capacity", "Occupied", "Students", "Payments", "Complaints", "Leaves"],
                datasets: [{ data: [data.summary.capacity, data.summary.occupied, data.summary.students, data.summary.payments, data.summary.complaintsOpen, data.summary.pendingLeaves], backgroundColor: ["#0f766e", "#2563eb", "#7c3aed", "#16a34a", "#ef4444", "#f59e0b"], borderRadius: 8 }]
              }}
            />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-black">Occupancy health</h2>
          <div className="mt-4 h-56">
            <Doughnut
              options={{ maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }}
              data={{
                labels: ["Occupied", "Vacant"],
                datasets: [{ data: [data.summary.occupied, Math.max((data.summary.capacity || 0) - (data.summary.occupied || 0), 0)], backgroundColor: ["#0f766e", "#d97706"], borderWidth: 0 }]
              }}
            />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{data.summary.occupancyRate}% occupancy rate across active rooms.</p>
        </Card>
      </section>
    </>
  );
}

function Rooms({ data, query, canEdit, openCreate, openEdit, removeRecord }) {
  return (
    <ModuleCard title="Rooms and beds" description="Manage room inventory, occupancy, amenities, and maintenance state." action={canEdit && <AddButton onClick={() => openCreate("rooms")} label="Add room" />}>
      <DataTable headers={["Room", "Type", "Floor", "Vacancy", "Price", "Amenities", "Status", canEdit ? "Action" : ""]}>
        {filterRows(data.rooms, query, ["roomNumber", "roomType", "floor", "status"]).map((room) => (
          <tr key={room.id} className="border-t">
            <Cell strong>{room.roomNumber}</Cell>
            <Cell>{room.roomType}</Cell>
            <Cell>{room.floor}</Cell>
            <Cell>{Math.max(room.capacity - room.currentOccupancy, 0)}/{room.capacity}</Cell>
            <Cell>{money(room.price)}</Cell>
            <Cell>{room.amenities}</Cell>
            <Cell><Status value={room.status} /></Cell>
            {canEdit && <Actions onEdit={() => openEdit("rooms", room)} onDelete={() => removeRecord("rooms", room.id)} />}
          </tr>
        ))}
      </DataTable>
    </ModuleCard>
  );
}

function Students({ data, query, canEdit, openCreate, openEdit, removeRecord }) {
  return (
    <ModuleCard title="Students" description="Maintain resident profiles, contacts, emergency details, and status." action={canEdit && <AddButton onClick={() => openCreate("students")} label="Add student" />}>
      <DataTable headers={["Name", "Email", "Phone", "University", "Emergency", "Status", canEdit ? "Action" : ""]}>
        {filterRows(data.students, query, ["name", "email", "phone", "university"]).map((student) => (
          <tr key={student.id} className="border-t">
            <Cell strong>{student.name}</Cell>
            <Cell>{student.email}</Cell>
            <Cell>{student.phone}</Cell>
            <Cell>{student.university}</Cell>
            <Cell>{student.emergencyContact} {student.emergencyPhone}</Cell>
            <Cell><Status value={student.status} /></Cell>
            {canEdit && <Actions onEdit={() => openEdit("students", student)} onDelete={() => removeRecord("students", student.id)} />}
          </tr>
        ))}
      </DataTable>
    </ModuleCard>
  );
}

function Bookings({ data, query, canEdit, openCreate, openEdit, bookingAction }) {
  return (
    <ModuleCard title="Bookings and allocations" description="Assign students to rooms, track stay dates, and checkout/cancel allocations." action={canEdit && <AddButton onClick={() => openCreate("bookings")} label="New booking" />}>
      <DataTable headers={["Student", "Room", "Check-in", "Check-out", "Amount", "Payment", "Status", canEdit ? "Action" : ""]}>
        {filterRows(data.bookings, query, ["status", "paymentStatus"]).map((booking) => (
          <tr key={booking.id} className="border-t">
            <Cell strong>{booking.student?.name || "Student"}</Cell>
            <Cell>{booking.room?.roomNumber}</Cell>
            <Cell>{booking.checkInDate}</Cell>
            <Cell>{booking.checkOutDate || "Open"}</Cell>
            <Cell>{money(booking.totalAmount)}</Cell>
            <Cell><Status value={booking.paymentStatus} /></Cell>
            <Cell><Status value={booking.status} /></Cell>
            {canEdit && (
              <td className="py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openEdit("bookings", booking)}><Pencil className="h-4 w-4" /> Edit</Button>
                  <Button variant="secondary" size="sm" onClick={() => bookingAction(booking, "checkout")}><CheckCircle2 className="h-4 w-4" /> Checkout</Button>
                  <Button variant="ghost" size="sm" onClick={() => bookingAction(booking, "cancel")}>Cancel</Button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </DataTable>
    </ModuleCard>
  );
}

function Payments({ data, query, canEdit, openCreate, openEdit }) {
  return (
    <ModuleCard title="Fees and payments" description="Record hostel fees, receipts, payment modes, and transaction status." action={canEdit && <AddButton onClick={() => openCreate("payments")} label="Record payment" />}>
      <DataTable headers={["Student", "Room", "Amount", "Date", "Method", "Transaction", "Status", canEdit ? "Action" : ""]}>
        {filterRows(data.payments, query, ["paymentMethod", "transactionId", "status", "remarks"]).map((payment) => (
          <tr key={payment.id} className="border-t">
            <Cell strong>{payment.booking?.student?.name || "Booking #" + payment.booking?.id}</Cell>
            <Cell>{payment.booking?.room?.roomNumber}</Cell>
            <Cell>{money(payment.amount)}</Cell>
            <Cell>{payment.paymentDate}</Cell>
            <Cell>{payment.paymentMethod}</Cell>
            <Cell>{payment.transactionId}</Cell>
            <Cell><Status value={payment.status} /></Cell>
            {canEdit && <td className="py-3 text-right"><Button variant="secondary" size="sm" onClick={() => openEdit("payments", payment)}><Pencil className="h-4 w-4" /> Edit</Button></td>}
          </tr>
        ))}
      </DataTable>
    </ModuleCard>
  );
}

function Complaints({ data, query, canEdit, role, openCreate, openEdit, patchRecord }) {
  return (
    <ModuleCard title="Complaints and maintenance" description="Students can raise issues; staff can assign, prioritize, and resolve them." action={<AddButton onClick={() => openCreate("complaints")} label={role === "student" ? "Raise complaint" : "Add complaint"} />}>
      <DataTable headers={["Issue", "Student", "Category", "Priority", "Assigned", "Status", canEdit ? "Action" : ""]}>
        {filterRows(data.complaints, query, ["title", "studentName", "category", "status"]).map((complaint) => (
          <tr key={complaint.id} className="border-t">
            <Cell strong>{complaint.title}<p className="mt-1 text-xs font-normal text-muted-foreground">{complaint.description}</p></Cell>
            <Cell>{complaint.studentName}</Cell>
            <Cell>{complaint.category}</Cell>
            <Cell><Status value={complaint.priority} /></Cell>
            <Cell>{complaint.assignedTo || "Unassigned"}</Cell>
            <Cell><Status value={complaint.status} /></Cell>
            {canEdit && (
              <td className="py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openEdit("complaints", complaint)}><Pencil className="h-4 w-4" /> Edit</Button>
                  <Button size="sm" onClick={() => patchRecord("complaints", complaint, { status: "RESOLVED" })}>Resolve</Button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </DataTable>
    </ModuleCard>
  );
}

function LeaveRequests({ data, query, canEdit, openCreate, openEdit, patchRecord }) {
  return (
    <ModuleCard title="Leave requests" description="Track resident leave plans and approval decisions." action={<AddButton onClick={() => openCreate("leaves")} label="Request leave" />}>
      <DataTable headers={["Student", "From", "To", "Reason", "Approved by", "Status", canEdit ? "Action" : ""]}>
        {filterRows(data.leaves, query, ["studentName", "reason", "status"]).map((leave) => (
          <tr key={leave.id} className="border-t">
            <Cell strong>{leave.studentName}</Cell>
            <Cell>{leave.fromDate}</Cell>
            <Cell>{leave.toDate}</Cell>
            <Cell>{leave.reason}</Cell>
            <Cell>{leave.approvedBy || "-"}</Cell>
            <Cell><Status value={leave.status} /></Cell>
            {canEdit && (
              <td className="py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openEdit("leaves", leave)}><Pencil className="h-4 w-4" /> Edit</Button>
                  <Button size="sm" onClick={() => patchRecord("leaves", leave, { status: "APPROVED", approvedBy: "Warden" })}>Approve</Button>
                  <Button variant="ghost" size="sm" onClick={() => patchRecord("leaves", leave, { status: "REJECTED", approvedBy: "Warden" })}>Reject</Button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </DataTable>
    </ModuleCard>
  );
}

function Visitors({ data, query, canEdit, openCreate, openEdit }) {
  return (
    <ModuleCard title="Visitors" description="Register visitor requests, purpose, timings, and gate status." action={<AddButton onClick={() => openCreate("visitors")} label="Add visitor" />}>
      <DataTable headers={["Visitor", "Student", "Phone", "Relation", "Purpose", "Check-in", "Status", canEdit ? "Action" : ""]}>
        {filterRows(data.visitors, query, ["visitorName", "studentName", "phone", "status"]).map((visitor) => (
          <tr key={visitor.id} className="border-t">
            <Cell strong>{visitor.visitorName}</Cell>
            <Cell>{visitor.studentName}</Cell>
            <Cell>{visitor.phone}</Cell>
            <Cell>{visitor.relation}</Cell>
            <Cell>{visitor.purpose}</Cell>
            <Cell>{formatDateTime(visitor.checkIn)}</Cell>
            <Cell><Status value={visitor.status} /></Cell>
            {canEdit && <td className="py-3 text-right"><Button variant="secondary" size="sm" onClick={() => openEdit("visitors", visitor)}><Pencil className="h-4 w-4" /> Edit</Button></td>}
          </tr>
        ))}
      </DataTable>
    </ModuleCard>
  );
}

function Attendance({ data, query, canEdit, openCreate, openEdit }) {
  return (
    <ModuleCard title="Attendance" description="Record daily presence, gate scans, QR checks, and manual corrections." action={canEdit && <AddButton onClick={() => openCreate("attendance")} label="Mark attendance" />}>
      <DataTable headers={["Student", "Date", "Status", "Method", canEdit ? "Action" : ""]}>
        {filterRows(data.attendance, query, ["studentName", "status", "method"]).map((record) => (
          <tr key={record.id} className="border-t">
            <Cell strong>{record.studentName}</Cell>
            <Cell>{record.attendanceDate}</Cell>
            <Cell><Status value={record.status} /></Cell>
            <Cell>{record.method}</Cell>
            {canEdit && <td className="py-3 text-right"><Button variant="secondary" size="sm" onClick={() => openEdit("attendance", record)}><Pencil className="h-4 w-4" /> Edit</Button></td>}
          </tr>
        ))}
      </DataTable>
    </ModuleCard>
  );
}

function Mess({ data, query, canEdit, openCreate, openEdit }) {
  return (
    <ModuleCard title="Mess menu" description="Publish daily food plans, snacks, dinner, and calorie targets." action={canEdit && <AddButton onClick={() => openCreate("messMenu")} label="Add menu" />}>
      <DataTable headers={["Day", "Breakfast", "Lunch", "Snacks", "Dinner", "Calories", canEdit ? "Action" : ""]}>
        {filterRows(data.messMenu, query, ["dayName", "breakfast", "lunch", "dinner"]).map((menu) => (
          <tr key={menu.id} className="border-t">
            <Cell strong>{menu.dayName}</Cell>
            <Cell>{menu.breakfast}</Cell>
            <Cell>{menu.lunch}</Cell>
            <Cell>{menu.snacks}</Cell>
            <Cell>{menu.dinner}</Cell>
            <Cell>{menu.calories}</Cell>
            {canEdit && <td className="py-3 text-right"><Button variant="secondary" size="sm" onClick={() => openEdit("messMenu", menu)}><Pencil className="h-4 w-4" /> Edit</Button></td>}
          </tr>
        ))}
      </DataTable>
    </ModuleCard>
  );
}

function Notices({ data, query, canEdit, openCreate, openEdit }) {
  return (
    <ModuleCard title="Notice board" description="Publish campus-wide announcements by audience and priority." action={canEdit && <AddButton onClick={() => openCreate("notices")} label="Publish notice" />}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filterRows(data.notices, query, ["title", "body", "audience", "priority"]).map((notice) => (
          <Card key={notice.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <Status value={notice.priority} />
              {canEdit && <Button variant="secondary" size="sm" onClick={() => openEdit("notices", notice)}><Pencil className="h-4 w-4" /> Edit</Button>}
            </div>
            <h3 className="mt-4 font-black">{notice.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{notice.body}</p>
            <p className="mt-4 text-xs font-semibold text-muted-foreground">Audience: {notice.audience}</p>
          </Card>
        ))}
      </div>
    </ModuleCard>
  );
}

function Security({ data, query, canEdit, openCreate, openEdit }) {
  return (
    <ModuleCard title="Security logs" description="Track entry, exit, incidents, and gate-desk observations." action={canEdit && <AddButton onClick={() => openCreate("securityLogs")} label="Add log" />}>
      <DataTable headers={["Type", "Student", "Message", "Severity", "Recorded", canEdit ? "Action" : ""]}>
        {filterRows(data.securityLogs, query, ["logType", "studentName", "message", "severity"]).map((log) => (
          <tr key={log.id} className="border-t">
            <Cell strong>{log.logType}</Cell>
            <Cell>{log.studentName}</Cell>
            <Cell>{log.message}</Cell>
            <Cell><Status value={log.severity} /></Cell>
            <Cell>{formatDateTime(log.recordedAt)}</Cell>
            {canEdit && <td className="py-3 text-right"><Button variant="secondary" size="sm" onClick={() => openEdit("securityLogs", log)}><Pencil className="h-4 w-4" /> Edit</Button></td>}
          </tr>
        ))}
      </DataTable>
    </ModuleCard>
  );
}

function ModuleCard({ title, description, action, children }) {
  return (
    <Card className="p-5">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-black">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

function DataTable({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="text-muted-foreground">
          <tr>
            {headers.filter(Boolean).map((header) => (
              <th key={header} className={cn("py-3", header === "Action" && "text-right")}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Cell({ children, strong = false }) {
  return <td className={cn("py-3 pr-4 align-top", strong && "font-bold")}>{children}</td>;
}

function Status({ value }) {
  return <Badge className={badgeTone(String(value || ""))}>{value || "UNKNOWN"}</Badge>;
}

function AddButton({ onClick, label }) {
  return <Button onClick={onClick}><Plus className="h-4 w-4" /> {label}</Button>;
}

function Actions({ onEdit, onDelete }) {
  return (
    <td className="py-3 text-right">
      <div className="flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={onEdit}><Pencil className="h-4 w-4" /> Edit</Button>
        <Button variant="ghost" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4" /> Delete</Button>
      </div>
    </td>
  );
}

function RecordModal({ modal, data, onClose, onChange, onSubmit }) {
  const fields = Object.keys(emptyForms[modal.moduleId] || {});
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4">
      <form onSubmit={onSubmit} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border bg-card p-5 shadow-luxe">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black">{modal.title}</h2>
            <p className="text-sm text-muted-foreground">Complete the fields and save the record.</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close form"><X className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <FormField key={field} moduleId={modal.moduleId} field={field} value={modal.record[field] ?? ""} data={data} onChange={(value) => onChange(field, value)} />
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </div>
  );
}

function FormField({ moduleId, field, value, data, onChange }) {
  const label = fieldLabels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  const textarea = ["description", "body", "address", "amenities", "message", "reason", "remarks"].includes(field);
  const number = ["capacity", "currentOccupancy", "price", "totalAmount", "amount", "calories"].includes(field);
  const date = ["checkInDate", "checkOutDate", "paymentDate", "fromDate", "toDate", "attendanceDate"].includes(field);
  const datetime = ["checkIn", "checkOut", "recordedAt"].includes(field);
  const options = optionList(moduleId, field, data);

  if (options) {
    return (
      <label className="text-sm font-semibold">
        {label}
        <select className="mt-2 w-full rounded-md border bg-background px-3 py-2 outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
    );
  }

  if (textarea) {
    return (
      <label className="text-sm font-semibold sm:col-span-2">
        {label}
        <textarea className="mt-2 min-h-24 w-full rounded-md border bg-background px-3 py-2 outline-none" value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    );
  }

  return (
    <label className="text-sm font-semibold">
      {label}
      <input
        className="mt-2 w-full rounded-md border bg-background px-3 py-2 outline-none"
        type={number ? "number" : date ? "date" : datetime ? "datetime-local" : "text"}
        min={number ? "0" : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function optionList(moduleId, field, data) {
  const fixed = {
    roomType: ["SINGLE", "DOUBLE", "TRIPLE", "DORMITORY"],
    status: statusOptions(moduleId),
    paymentStatus: ["PENDING", "PARTIAL", "PAID"],
    paymentMethod: ["UPI", "CASH", "CARD", "BANK_TRANSFER"],
    priority: ["LOW", "MEDIUM", "HIGH", "IMPORTANT", "NORMAL"],
    category: ["MAINTENANCE", "HOUSEKEEPING", "SERVICE", "SECURITY", "MESS"],
    audience: ["ALL", "STUDENTS", "WARDENS", "ADMINS"],
    method: ["QR", "MANUAL", "BIOMETRIC"],
    dayName: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    logType: ["ENTRY", "EXIT", "INCIDENT", "VISITOR", "MAINTENANCE"],
    severity: ["LOW", "MEDIUM", "HIGH"]
  };
  if (field === "studentId") return data.students.map((student) => ({ value: student.id, label: student.name }));
  if (field === "roomId") return data.rooms.map((room) => ({ value: room.id, label: `${room.roomNumber} (${room.roomType})` }));
  if (field === "bookingId") return data.bookings.map((booking) => ({ value: booking.id, label: `#${booking.id} - ${booking.student?.name || "Student"} / ${booking.room?.roomNumber || "Room"}` }));
  const values = fixed[field];
  return values ? values.map((item) => ({ value: item, label: item })) : null;
}

function statusOptions(moduleId) {
  const map = {
    rooms: ["AVAILABLE", "FULL", "MAINTENANCE"],
    students: ["ACTIVE", "INACTIVE", "SUSPENDED"],
    bookings: ["ACTIVE", "COMPLETED", "CANCELLED"],
    payments: ["SUCCESS", "PENDING", "FAILED"],
    complaints: ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED"],
    leaves: ["PENDING", "APPROVED", "REJECTED"],
    visitors: ["REQUESTED", "APPROVED", "CHECKED_IN", "CHECKED_OUT", "REJECTED"],
    attendance: ["PRESENT", "ABSENT", "LATE"]
  };
  return map[moduleId] || ["ACTIVE", "PENDING", "CLOSED"];
}

function moduleTitle(moduleId) {
  const titles = {
    rooms: "room",
    students: "student",
    bookings: "booking",
    payments: "payment",
    complaints: "complaint",
    leaves: "leave request",
    visitors: "visitor",
    attendance: "attendance",
    notices: "notice",
    messMenu: "mess menu",
    securityLogs: "security log"
  };
  return titles[moduleId] || "record";
}

function toFormRecord(moduleId, record) {
  if (moduleId === "bookings") return { ...record, studentId: record.student?.id || "", roomId: record.room?.id || "" };
  if (moduleId === "payments") return { ...record, bookingId: record.booking?.id || "" };
  if (moduleId === "visitors") return { ...record, checkIn: formatInputDateTime(record.checkIn), checkOut: formatInputDateTime(record.checkOut) };
  if (moduleId === "securityLogs") return { ...record, recordedAt: formatInputDateTime(record.recordedAt) };
  return { ...record };
}

function toPayload(moduleId, record) {
  const numericFields = ["capacity", "currentOccupancy", "price", "totalAmount", "amount", "calories"];
  const payload = { ...record };
  numericFields.forEach((field) => {
    if (field in payload) payload[field] = Number(payload[field] || 0);
  });
  if (moduleId === "bookings") {
    payload.student = { id: Number(payload.studentId) };
    payload.room = { id: Number(payload.roomId) };
    delete payload.studentId;
    delete payload.roomId;
  }
  if (moduleId === "payments") {
    payload.booking = { id: Number(payload.bookingId) };
    delete payload.bookingId;
  }
  return payload;
}

function filterRows(rows, query, keys) {
  if (!query) return rows;
  const needle = query.toLowerCase();
  return rows.filter((row) => keys.some((key) => String(row[key] || "").toLowerCase().includes(needle)));
}

function badgeTone(value = "") {
  const status = value.toUpperCase();
  if (["SUCCESS", "PAID", "PRESENT", "APPROVED", "AVAILABLE", "LOW", "ACTIVE", "RESOLVED"].includes(status)) return "text-teal-700 border-teal-200 bg-teal-50 dark:bg-teal-950/30";
  if (["HIGH", "FAILED", "REJECTED", "FULL", "OVERDUE", "OPEN"].includes(status)) return "text-red-700 border-red-200 bg-red-50 dark:bg-red-950/30";
  return "text-amber-700 border-amber-200 bg-amber-50 dark:bg-amber-950/30";
}

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function formatDateTime(value) {
  if (!value) return "-";
  return String(value).replace("T", " ").slice(0, 16);
}

function formatInputDateTime(value) {
  if (!value) return "";
  return String(value).slice(0, 16);
}
