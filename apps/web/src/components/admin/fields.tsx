"use client";

import { useRef, useState } from "react";
import { marked } from "marked";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { slugify } from "@diner/shared";
import { isoToLocalInput, localInputToIso, uploadMedia } from "@/lib/admin/client";
import { cn } from "@/lib/utils";

export type FieldType =
  | "text" | "slug" | "textarea" | "markdown" | "number" | "boolean" | "select" | "image"
  | "tags" | "datetime" | "date" | "time" | "url" | "email" | "stringList" | "objectList" | "imageList";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** slug: field to generate from */
  from?: string;
  /** image: storage folder */
  folder?: string;
  /** objectList: sub-fields */
  fields?: Field[];
  /** grid span on wide screens */
  wide?: boolean;
  rows?: number;
}

type Values = Record<string, unknown>;

export function FieldInput({
  field,
  value,
  onChange,
  values,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  values?: Values;
}) {
  const id = `f-${field.name}`;
  const common = "field";
  switch (field.type) {
    case "textarea":
      return <textarea id={id} className={cn(common, "resize-y")} rows={field.rows ?? 3} value={(value as string) ?? ""} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case "markdown":
      return <MarkdownField id={id} value={(value as string) ?? ""} onChange={onChange} rows={field.rows} />;
    case "number":
      return (
        <input
          id={id}
          type="number"
          step="any"
          className={common}
          value={value === null || value === undefined ? "" : String(value)}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      );
    case "boolean":
      return (
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          className={cn("relative inline-flex h-7 w-12 items-center rounded-full transition", value ? "bg-brass" : "bg-black/15")}
        >
          <span className={cn("inline-block size-5 rounded-full bg-snow shadow transition", value ? "translate-x-6" : "translate-x-1")} />
        </button>
      );
    case "select":
      return (
        <select id={id} className={common} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
          {!field.required && <option value="">—</option>}
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "image":
      return <ImageField value={(value as string) ?? ""} onChange={onChange} folder={field.folder} />;
    case "imageList":
      return <ImageListField value={(value as string[]) ?? []} onChange={onChange} folder={field.folder} />;
    case "tags":
      return <TagsField value={(value as string[]) ?? []} onChange={onChange} />;
    case "stringList":
      return <StringListField value={(value as string[]) ?? []} onChange={onChange} placeholder={field.placeholder} />;
    case "objectList":
      return <ObjectListField value={(value as Values[]) ?? []} onChange={onChange} fields={field.fields ?? []} />;
    case "datetime":
      return (
        <input
          id={id}
          type="datetime-local"
          className={cn(common, "[color-scheme:light]")}
          value={isoToLocalInput(value as string)}
          onChange={(e) => onChange(localInputToIso(e.target.value))}
        />
      );
    case "date":
      return <input id={id} type="date" className={cn(common, "[color-scheme:light]")} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value || null)} />;
    case "time":
      return <input id={id} type="time" className={cn(common, "[color-scheme:light]")} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "slug":
      return (
        <div className="flex gap-2">
          <input id={id} className={common} value={(value as string) ?? ""} onChange={(e) => onChange(slugify(e.target.value))} placeholder="auto-generated" />
          {field.from && (
            <button type="button" className="btn-ghost shrink-0 !px-4 !py-2 text-xs" onClick={() => onChange(slugify(String(values?.[field.from!] ?? "")))}>
              Generate
            </button>
          )}
        </div>
      );
    default:
      return (
        <input
          id={id}
          type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
          className={common}
          value={(value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

export function FieldRow({ field, children }: { field: Field; children: React.ReactNode }) {
  return (
    <div className={cn(field.wide !== false && ["markdown", "textarea", "image", "imageList", "objectList", "stringList", "tags"].includes(field.type) && "sm:col-span-2", field.wide && "sm:col-span-2")}>
      <label htmlFor={`f-${field.name}`} className="label">
        {field.label}
        {field.required && <span className="text-brass"> *</span>}
      </label>
      {children}
      {field.help && <p className="mt-1.5 text-xs text-muted">{field.help}</p>}
    </div>
  );
}

export function FieldGrid({ fields, values, onChange }: { fields: Field[]; values: Values; onChange: (name: string, v: unknown) => void }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => (
        <FieldRow key={f.name} field={f}>
          <FieldInput field={f} value={values[f.name]} values={values} onChange={(v) => onChange(f.name, v)} />
        </FieldRow>
      ))}
    </div>
  );
}

function MarkdownField({ id, value, onChange, rows = 14 }: { id: string; value: string; onChange: (v: string) => void; rows?: number }) {
  const [preview, setPreview] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const insert = (before: string, after = "") => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const next = value.slice(0, s) + before + value.slice(s, e) + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, e + before.length);
    });
  };
  return (
    <div className="overflow-hidden rounded-xl border border-black/10">
      <div className="flex flex-wrap items-center gap-1 border-b border-black/10 bg-black/[0.03] px-2 py-1.5 text-xs">
        {[
          ["H2", () => insert("\n## ")],
          ["H3", () => insert("\n### ")],
          ["Bold", () => insert("**", "**")],
          ["Italic", () => insert("_", "_")],
          ["Link", () => insert("[", "](https://)")],
          ["List", () => insert("\n- ")],
          ["Quote", () => insert("\n> ")],
        ].map(([label, fn]) => (
          <button key={label as string} type="button" onClick={fn as () => void} className="rounded-md px-2 py-1 text-sand hover:bg-black/10 hover:text-cream">
            {label as string}
          </button>
        ))}
        <ImageUploadButton onUploaded={(url) => insert(`\n![](${url})\n`)} />
        <button type="button" onClick={() => setPreview((p) => !p)} className="ml-auto rounded-md px-2 py-1 font-semibold text-brass hover:bg-black/10">
          {preview ? "Edit" : "Preview"}
        </button>
      </div>
      {preview ? (
        <div className="prose prose-invert prose-diner max-w-none p-4" dangerouslySetInnerHTML={{ __html: marked.parse(value, { async: false }) as string }} />
      ) : (
        <textarea id={id} ref={ref} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="block w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-cream outline-none" />
      )}
    </div>
  );
}

function ImageUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <>
      <button type="button" onClick={() => input.current?.click()} className="rounded-md px-2 py-1 text-sand hover:bg-black/10 hover:text-cream" disabled={busy}>
        {busy ? "Uploading…" : "Image"}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          try {
            onUploaded(await uploadMedia(file, "blog"));
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

export function ImageField({ value, onChange, folder = "uploads" }: { value: string; onChange: (v: string | null) => void; folder?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  async function handle(file?: File | null) {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Max file size is 15 MB.");
      return;
    }
    setBusy(true);
    try {
      onChange(await uploadMedia(file, folder));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void handle(e.dataTransfer.files[0]);
        }}
        className={cn(
          "relative flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed bg-black/[0.03] sm:w-48",
          drag ? "border-brass" : "border-black/15",
        )}
      >
        {busy ? (
          <Loader2 className="size-5 animate-spin text-brass" />
        ) : value ? (
          /\.mp4($|\?)/.test(value) ? (
            <video src={value} className="size-full object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary pasted URLs
            <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
          )
        ) : (
          <span className="flex flex-col items-center gap-2 text-xs text-muted">
            <ImagePlus className="size-6" /> Drop or click to upload
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col gap-2">
        <input className="field text-xs" placeholder="…or paste an image URL" value={value} onChange={(e) => onChange(e.target.value || null)} />
        {value && (
          <button type="button" onClick={() => onChange(null)} className="inline-flex w-fit items-center gap-1 text-xs text-muted hover:text-ember">
            <X className="size-3" /> Remove
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*,video/mp4" hidden onChange={(e) => void handle(e.target.files?.[0])} />
    </div>
  );
}

function TagsField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim().toLowerCase();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  return (
    <div className="field flex flex-wrap items-center gap-2 !py-2">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-full bg-black/10 px-2.5 py-1 text-xs">
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`}>
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder="Type and press Enter"
        className="min-w-[8rem] flex-1 bg-transparent text-sm outline-none"
      />
    </div>
  );
}

function move<T>(arr: T[], i: number, d: number) {
  const next = [...arr];
  const j = i + d;
  if (j < 0 || j >= next.length) return arr;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function StringListField({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input className="field !py-2" value={v} placeholder={placeholder} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="px-2 text-muted hover:text-ember" aria-label="Remove">
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ""])} className="inline-flex items-center gap-1 text-xs font-semibold text-brass">
        <Plus className="size-3.5" /> Add
      </button>
    </div>
  );
}

function ObjectListField({ value, onChange, fields }: { value: Values[]; onChange: (v: Values[]) => void; fields: Field[] }) {
  const blank = () => Object.fromEntries(fields.map((f) => [f.name, f.type === "boolean" ? false : ""]));
  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">#{i + 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => onChange(move(value, i, -1))} className="p-1.5 text-muted hover:text-cream" aria-label="Move up">
                <ArrowUp className="size-4" />
              </button>
              <button type="button" onClick={() => onChange(move(value, i, 1))} className="p-1.5 text-muted hover:text-cream" aria-label="Move down">
                <ArrowDown className="size-4" />
              </button>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="p-1.5 text-muted hover:text-ember" aria-label="Remove">
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
          <FieldGrid
            fields={fields.map((f) => ({ ...f, name: f.name }))}
            values={item}
            onChange={(name, v) => onChange(value.map((x, j) => (j === i ? { ...x, [name]: v } : x)))}
          />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, blank()])} className="inline-flex items-center gap-1 text-xs font-semibold text-brass">
        <Plus className="size-3.5" /> Add item
      </button>
    </div>
  );
}

function ImageListField({ value, onChange, folder }: { value: string[]; onChange: (v: string[]) => void; folder?: string }) {
  return (
    <div className="space-y-3">
      {value.map((url, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">
            <ImageField value={url} folder={folder} onChange={(v) => onChange(value.map((x, j) => (j === i ? v ?? "" : x)))} />
          </div>
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="p-2 text-muted hover:text-ember" aria-label="Remove image">
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ""])} className="inline-flex items-center gap-1 text-xs font-semibold text-brass">
        <Plus className="size-3.5" /> Add image
      </button>
    </div>
  );
}
