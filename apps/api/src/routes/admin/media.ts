import { Router } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { db, MEDIA_BUCKET, publicMediaUrl } from "../../lib/supabase";
import { HttpError } from "../../lib/http";
import { audit } from "../../lib/audit";

export const mediaRouter = Router();

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype in ALLOWED),
});

/** Upload one file (field name "file"). Returns its public URL. */
mediaRouter.post("/", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) throw new HttpError(400, "Upload a JPG, PNG, WebP, AVIF, GIF or MP4 file.");
  const folder = z
    .enum(["uploads", "menu", "blog", "events", "gallery", "home"])
    .catch("uploads")
    .parse(req.body?.folder);
  const now = new Date();
  const path = `${folder}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${randomUUID()}.${ALLOWED[file.mimetype]}`;
  const { error } = await db.storage
    .from(MEDIA_BUCKET)
    .upload(path, file.buffer, { contentType: file.mimetype, cacheControl: "31536000", upsert: false });
  if (error) throw new HttpError(500, `Upload failed: ${error.message}`);
  await audit(req, "upload", "media", path, { size: file.size });
  res.status(201).json({ url: publicMediaUrl(path), path });
});

/** Browse previously uploaded files in a folder. */
mediaRouter.get("/", async (req, res) => {
  const folder = z.string().regex(/^[a-z0-9/_-]*$/).catch("uploads").parse(req.query.folder);
  const { data, error } = await db.storage
    .from(MEDIA_BUCKET)
    .list(folder, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw new HttpError(500, error.message);
  res.json({
    data: (data ?? []).map((f) => ({
      name: f.name,
      isFolder: !f.id,
      path: `${folder}/${f.name}`.replace(/^\//, ""),
      url: f.id ? publicMediaUrl(`${folder}/${f.name}`) : null,
    })),
  });
});
