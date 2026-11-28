"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageAnimations from "@/components/PageAnimations";

type Category = "BEI" | "HMMI";

type Contact = {
  id: string;
  no: string;
  name: string;
  phone: string;
  email: string;
  organization: string;
  category: Category;
};

type ContactForm = {
  name: string;
  phone: string;
  email: string;
  organization: string;
  category: Category;
};

type ContactTableProps = {
  title: string;
  subtitle: string;
  category: Category;
  data: Contact[];
  search: string;
  setSearch: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  filterOptions: string[];
  color: "blue" | "emerald";
  onAdd: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
};

const emptyForm: ContactForm = {
  name: "",
  phone: "",
  email: "",
  organization: "",
  category: "BEI",
};

async function contactApi(payload: Record<string, unknown>) {
  const response = await fetch("/api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Terjadi kesalahan.");
  }

  return result;
}

function whatsappNumber(phone: string) {
  let number = phone.replace(/\D/g, "");

  if (number.startsWith("0")) {
    number = "62" + number.slice(1);
  } else if (number.startsWith("8")) {
    number = "62" + number;
  }

  return number;
}

function whatsappLink(contact: Contact) {
  const number = whatsappNumber(contact.phone);

  const message = `Assalamualaikum, Maaf pak ${contact.name} Mengganggu waktunya, `;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function ContactTable({
  title,
  subtitle,
  category,
  data,
  search,
  setSearch,
  filter,
  setFilter,
  filterOptions,
  color,
  onAdd,
  onEdit,
  onDelete,
}: ContactTableProps) {
  const isBlue = color === "blue";

  const accent = isBlue ? "bg-blue-600" : "bg-emerald-600";

  const badge = isBlue
    ? "bg-blue-50 text-blue-700"
    : "bg-emerald-50 text-emerald-700";

  const countColor = isBlue
    ? "text-blue-600"
    : "text-emerald-600";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      
      <div className={`h-1.5 ${accent}`} />

      <div className="p-5 sm:p-7">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black tracking-tight text-[#0b1220]">
                {title}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${badge}`}
              >
                {category}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>

            <p className={`mt-2 text-xs font-bold ${countColor}`}>
              {data.length} kontak ditemukan
            </p>
          </div>

        </div>

        <div className="mt-6 grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_44px] items-center gap-2 sm:gap-3 md:grid-cols-[minmax(0,1fr)_260px_48px]">

          <div className="relative min-w-0">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Cari nama, nomor, email, atau jabatan ${category}...`}
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-2 text-xs outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:pl-11 sm:pr-4 sm:text-sm"
            />
          </div>

          <div className="relative min-w-0">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 sm:left-4">
              ▤
            </span>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full min-w-0 appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-8 pr-5 text-xs outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:pl-11 sm:pr-9 sm:text-sm"
            >
              <option value="ALL">
                Department
              </option>

              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              ▼
            </span>
          </div>

          <button
            type="button"
            onClick={onAdd}
            title="Tambah kontak"
            aria-label={`Tambah kontak ${category}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b1220] text-2xl font-medium leading-none text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            +
          </button>
        </div>

        {(search || filter !== "ALL") && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-500">
              Menampilkan {data.length} kontak sesuai pencarian dan filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("ALL");
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Reset Filter
            </button>
          </div>
        )}

        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-[#0b1220] text-white">
              <tr>
                <th className="px-4 py-4 font-bold">No</th>
                <th className="px-4 py-4 font-bold">Nama</th>
                <th className="px-4 py-4 font-bold">Nomor Telepon</th>
                <th className="px-4 py-4 font-bold">Email</th>
                <th className="px-4 py-4 font-bold">
                  Organisasi / Jabatan
                </th>
                <th className="px-4 py-4 text-center font-bold">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.length > 0 ? (
                data.map((contact, index) => (
                  <tr
                    key={contact.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 text-slate-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 font-bold text-[#0b1220]">
                      {contact.name}
                    </td>

                    <td className="px-4 py-4">
                      <a
                        href={`tel:${contact.phone.replace(/\s/g, "")}`}
                        className="font-semibold text-slate-700 transition hover:text-blue-600"
                      >
                        {contact.phone}
                      </a>
                    </td>

                    <td className="px-4 py-4">
                      {contact.email ? (
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-slate-500 transition hover:text-blue-600"
                        >
                          {contact.email}
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {contact.organization || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">

                        <a
                          href={whatsappLink(contact)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Chat melalui WhatsApp"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M20.52 3.48A11.78 11.78 0 0 0 12.13 0C5.62 0 .32 5.3.32 11.81c0 2.08.55 4.12 1.59 5.91L.22 24l6.43-1.68a11.8 11.8 0 0 0 5.47 1.35h.01c6.51 0 11.81-5.3 11.81-11.81 0-3.16-1.23-6.13-3.42-8.38ZM12.13 21.65a9.82 9.82 0 0 1-5.01-1.37l-.36-.21-3.81 1 1.02-3.71-.24-.38a9.82 9.82 0 1 1 8.4 4.67Zm5.39-7.36c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.33.44-.49.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49h-.54c-.19 0-.5.07-.76.36-.26.29-1  .98-1 2.38 0 1.4 1.02 2.75 1.16 2.94.14.19 2 3.05 4.85 4.28.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.12.55-.08 1.7-.69 1.94-1.35.24-.67.24-1.23.17-1.35-.07-.12-.26-.19-.55-.34Z" />
                          </svg>
                          Chat
                        </a>

                        <button
                          type="button"
                          onClick={() => onEdit(contact)}
                          title="Edit kontak"
                          className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(contact)}
                          title="Hapus kontak"
                          className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center"
                  >
                    <div className="text-3xl text-slate-300">
                      ◯
                    </div>

                    <p className="mt-3 font-semibold text-slate-500">
                      Tidak ada kontak ditemukan.
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Coba ubah kata kunci pencarian atau filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-500">
            Total: {data.length} Contact(s)
          </p>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [token, setToken] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [searchBEI, setSearchBEI] = useState("");
  const [searchHMMI, setSearchHMMI] = useState("");
  const [filterBEI, setFilterBEI] = useState("ALL");
  const [filterHMMI, setFilterHMMI] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ContactForm>(emptyForm);

  async function loadContacts(currentToken: string) {
    setLoadingData(true);
    setError("");

    try {
      const result = await contactApi({
        action: "list",
        token: currentToken,
      });

      setContacts(result.contacts || []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal mengambil data kontak.";

      setError(message);

      if (message.toLowerCase().includes("sesi")) {
        sessionStorage.removeItem("contact_token");
        setToken("");
        setContacts([]);
      }
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    const savedToken = sessionStorage.getItem("contact_token");

    if (savedToken) {
      setToken(savedToken);
      loadContacts(savedToken);
    }
  }, []);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const result = await contactApi({
        action: "login",
        password,
      });

      sessionStorage.setItem("contact_token", result.token);

      setToken(result.token);
      setPassword("");

      await loadContacts(result.token);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login gagal."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("contact_token");

    setToken("");
    setContacts([]);
    setPassword("");

    setSearchBEI("");
    setSearchHMMI("");

    setFilterBEI("ALL");
    setFilterHMMI("ALL");

    setNotice("");
    setError("");
  }

  function openAdd(category: Category) {
    setEditingId(null);

    setForm({
      ...emptyForm,
      category,
    });

    setError("");
    setModalOpen(true);
  }

  function openEdit(contact: Contact) {
    setEditingId(contact.id);

    setForm({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      organization: contact.organization,
      category: contact.category,
    });

    setError("");
    setModalOpen(true);
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!token) return;

    setLoading(true);
    setError("");
    setNotice("");

    try {
      if (editingId) {
        await contactApi({
          action: "update",
          token,
          id: editingId,
          contact: form,
        });

        setNotice("Kontak berhasil diperbarui.");
      } else {
        await contactApi({
          action: "create",
          token,
          contact: form,
        });

        setNotice("Kontak berhasil ditambahkan.");
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);

      await loadContacts(token);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan kontak."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(contact: Contact) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus kontak ${contact.name}?`
    );

    if (!confirmed || !token) return;

    setError("");
    setNotice("");

    try {
      await contactApi({
        action: "delete",
        token,
        id: contact.id,
      });

      setNotice(`${contact.name} berhasil dihapus.`);

      await loadContacts(token);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus kontak."
      );
    }
  }

  const beiFilterOptions = useMemo(() => {
    return Array.from(
      new Set(
        contacts
          .filter((contact) => contact.category === "BEI")
          .map((contact) => contact.organization.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [contacts]);

  const hmmiFilterOptions = useMemo(() => {
    return Array.from(
      new Set(
        contacts
          .filter((contact) => contact.category === "HMMI")
          .map((contact) => contact.organization.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [contacts]);

  const beiContacts = useMemo(() => {
    const keyword = searchBEI.toLowerCase().trim();

    return contacts.filter((contact) => {
      const matchesCategory = contact.category === "BEI";

      const matchesSearch = [
        contact.name,
        contact.phone,
        contact.email,
        contact.organization,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      const matchesFilter =
        filterBEI === "ALL" ||
        contact.organization.trim() === filterBEI;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesFilter
      );
    });
  }, [contacts, searchBEI, filterBEI]);

  const hmmiContacts = useMemo(() => {
    const keyword = searchHMMI.toLowerCase().trim();

    return contacts.filter((contact) => {
      const matchesCategory = contact.category === "HMMI";

      const matchesSearch = [
        contact.name,
        contact.phone,
        contact.email,
        contact.organization,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      const matchesFilter =
        filterHMMI === "ALL" ||
        contact.organization.trim() === filterHMMI;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesFilter
      );
    });
  }, [contacts, searchHMMI, filterHMMI]);

  const totalBEI = contacts.filter(
    (contact) => contact.category === "BEI"
  ).length;

  const totalHMMI = contacts.filter(
    (contact) => contact.category === "HMMI"
  ).length;

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#0b1220]">

      <Navbar />
      <PageAnimations />

      <section
        data-hero
        className="relative overflow-hidden bg-[#0b1220]"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">

            <div
              data-hero-item
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold tracking-[0.18em] text-blue-300"
            >
              CONTACT
            </div>

            <h1
              data-hero-item
              className="text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
            >
              Need Help?
              <br />
              <span className="text-blue-500">
                Get in Touch.
              </span>
            </h1>

            <p
              data-hero-item
              className="mt-8 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
            >
              Have questions about the training program, assessment,
              or learning materials? Contact the BEI Quality Training
              Center for assistance.
            </p>

          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 lg:px-10 lg:py-15">
        <div>
            <p className="text-xs font-black tracking-[0.2em] text-blue-600">
              CONTACT DATABASE
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Contact Directory
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Manage internal contacts and customer contacts in one
              centralized database.
            </p>
          </div>

        <div data-card-group className="grid grid-cols-2 gap-3 sm:gap-5">

          <div
            data-card
            className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_25px_60px_-25px_rgba(15,23,42,0.3)] sm:p-7"
          >

            <div className="absolute left-0 top-0 h-1 w-full bg-blue-600" />

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl sm:h-14 sm:w-14 sm:text-2xl">
              ✉
            </div>

            <p className="mt-4 text-[9px] font-bold tracking-[0.12em] text-blue-600 sm:mt-7 sm:text-xs sm:tracking-[0.2em]">
              EMAIL
            </p>

            <h2 className="mt-2 text-base font-black tracking-tight sm:mt-3 sm:text-2xl">
              Email Us
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">
              Send us an email for questions, information, or
              assistance related to the training program.
            </p>

            <a
              href="mailto:qc_05@bumjin.co.id"
              className="mt-4 inline-flex max-w-full items-center gap-1 break-all text-xs font-bold text-[#0b1220] transition hover:text-blue-600 sm:mt-6 sm:gap-2 sm:text-base"
            >
              qc_05@bumjin.co.id
              <span>↗</span>
            </a>

          </div>

          <div data-card
            className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_25px_60px_-25px_rgba(15,23,42,0.3)] sm:p-7"
          >

            <div className="absolute left-0 top-0 h-1 w-full bg-[#0b1220]" />

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl sm:h-14 sm:w-14 sm:text-2xl">
              ☎
            </div>

            <p className="mt-4 text-[9px] font-bold tracking-[0.12em] text-slate-600 sm:mt-7 sm:text-xs sm:tracking-[0.2em]">
              PHONE / WHATSAPP
            </p>

            <h2 className="mt-2 text-base font-black tracking-tight sm:mt-3 sm:text-2xl">
              Contact Us
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">
              Contact the Quality Training Center directly for
              further assistance.
            </p>

            <a
              href="tel:0895385191979"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0b1220] transition hover:text-blue-600 sm:mt-6 sm:gap-2 sm:text-base"
            >
              0895 3851 91979
              <span>↗</span>
            </a>

          </div>

        </div>
      </section>


      <section className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-5">

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          {token && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <span>🔒</span>
              Lock Contacts
            </button>
          )}

        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {notice && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              className="font-bold"
            >
              ×
            </button>
          </div>
        )}

        {!token ? (

          <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_60px_-25px_rgba(15,23,42,0.2)]">

            <div className="h-1.5 bg-blue-600" />

            <div className="p-7 sm:p-10">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                🔐
              </div>

              <h3 className="mt-6 text-center text-2xl font-black">
                Access Contact Directory
              </h3>

              <p className="mt-3 text-center text-sm leading-6 text-slate-500">
                Enter the access password to view and manage
                internal and customer contacts.
              </p>

              <form onSubmit={handleLogin} className="mt-8">

                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 pr-16 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

                <button
                  type="submit"
                  disabled={loading || !password}
                  className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Checking..." : "Unlock Contacts →"}
                </button>

              </form>

              <p className="mt-5 text-center text-xs text-slate-400">
                Authorized access only
              </p>

            </div>
          </div>

        ) : loadingData ? (

          <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">

            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-semibold text-slate-500">
              Loading contact database...
            </p>

          </div>

        ) : (

          <div className="space-y-8">

            <div className="grid grid-cols-3 gap-2 sm:gap-4">

              <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-5">
                <p className="text-[9px] font-bold tracking-wider text-slate-400 sm:text-xs">
                  TOTAL CONTACTS
                </p>

                <p className="mt-2 text-2xl font-black sm:text-3xl">
                  {contacts.length}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 sm:p-5">
                <p className="text-[9px] font-bold tracking-wider text-blue-600 sm:text-xs">
                  INTERNAL · BEI
                </p>

                <p className="mt-2 text-2xl font-black text-blue-900 sm:text-3xl">
                  {totalBEI}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 sm:p-5">
                <p className="text-[9px] font-bold tracking-wider text-emerald-600 sm:text-xs">
                  CUSTOMER · HMMI
                </p>

                <p className="mt-2 text-2xl font-black text-emerald-900 sm:text-3xl">
                  {totalHMMI}
                </p>
              </div>

            </div>

            <ContactTable
              title="Internal Contact"
              subtitle="Bumjin Electronics Indonesia / BEI"
              category="BEI"
              data={beiContacts}
              search={searchBEI}
              setSearch={setSearchBEI}
              filter={filterBEI}
              setFilter={setFilterBEI}
              filterOptions={beiFilterOptions}
              color="blue"
              onAdd={() => openAdd("BEI")}
              onEdit={openEdit}
              onDelete={handleDelete}
            />

            <ContactTable
              title="Customer Contact"
              subtitle="Hyundai Motor Manufacturing Indonesia / HMMI"
              category="HMMI"
              data={hmmiContacts}
              search={searchHMMI}
              setSearch={setSearchHMMI}
              filter={filterHMMI}
              setFilter={setFilterHMMI}
              filterOptions={hmmiFilterOptions}
              color="emerald"
              onAdd={() => openAdd("HMMI")}
              onEdit={openEdit}
              onDelete={handleDelete}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4">

              <p className="text-xs text-slate-500">
                Contact data is synchronized with Google Sheets.
              </p>

              <button
                type="button"
                onClick={() => loadContacts(token)}
                disabled={loadingData}
                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
              >
                {loadingData ? "Loading..." : "↻ Refresh Data"}
              </button>

            </div>

          </div>
        )}

      </section>

      {modalOpen && token && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h3 className="text-xl font-black">
                  {editingId ? "Edit Contact" : "Add New Contact"}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Contact Management · Google Sheets
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSave} className="space-y-5 p-6">

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Nama *
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Masukkan nama kontak"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Nomor Telepon *
                </label>

                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="Contoh: 081234567890"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Organisasi / Jabatan
                </label>

                <input
                  value={form.organization}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      organization: e.target.value,
                    })
                  }
                  placeholder="Contoh: QC OK Line"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Kategori *
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as Category,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  <option value="BEI">
                    Internal Contact - BEI
                  </option>

                  <option value="HMMI">
                    Customer Contact - HMMI
                  </option>
                </select>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Add Contact"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
      
      <footer className="border-t border-slate-200 bg-[#f6f7f9]">

        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">

          <div>
            <p className="font-bold text-slate-700">
              BEI QUALITY TRAINING
            </p>

            <p className="mt-1">
              Quality • Automotive • Continuous Improvement
            </p>
          </div>

          <p>© 2026 BEI Quality Training</p>

        </div>
      </footer>

    </main>
  );
}
