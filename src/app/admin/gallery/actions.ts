"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  extractYouTubeId,
  PhotoCategory,
  VideoCategory,
} from "@/lib/gallery/utils";

export async function uploadGalleryPhotosAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized: Admin authentication required",
      };
    }

    const category = (formData.get("category") as PhotoCategory) || "Events";
    const caption_bn = (formData.get("caption_bn") as string) || null;
    const caption_en = (formData.get("caption_en") as string) || null;

    const files = formData.getAll("files") as File[];

    if (
      !files ||
      files.length === 0 ||
      (files.length === 1 && files[0].size === 0)
    ) {
      return { success: false, error: "At least one photo file is required" };
    }

    const insertedItems = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
      const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${cleanName}`;
      const storagePath = `${category.toLowerCase().replace(/[^a-z0-9]/g, "_")}/${uniqueFilename}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(storagePath, buffer, {
          contentType: file.type || "image/webp",
          upsert: true,
        });

      if (uploadError) {
        console.error("Gallery image upload error:", uploadError);
        return {
          success: false,
          error: `Failed to upload image ${file.name}: ${uploadError.message}`,
        };
      }

      const { data: publicUrlData } = supabase.storage
        .from("gallery-images")
        .getPublicUrl(storagePath);

      const imageUrl = publicUrlData.publicUrl;

      const { data: dbData, error: dbError } = await (
        supabase.from("gallery_items") as any
      )
        .insert({
          image_url: imageUrl,
          thumb_url: imageUrl,
          category,
          caption_bn,
          caption_en,
          sort_order: 0,
          is_published: true,
        })
        .select("*")
        .single();

      if (dbError) {
        console.error("Database insert error for gallery photo:", dbError);
        return {
          success: false,
          error: `Failed to save photo metadata: ${dbError.message}`,
        };
      }

      insertedItems.push(dbData);
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath("/bn/gallery");
    revalidatePath("/en/gallery");

    return {
      success: true,
      message: `${insertedItems.length} photo(s) uploaded successfully`,
    };
  } catch (err: any) {
    console.error("Unexpected error in uploadGalleryPhotosAction:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
}

export async function deleteGalleryPhotoAction(id: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await (supabase.from("gallery_items") as any)
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath("/bn/gallery");
    revalidatePath("/en/gallery");

    return { success: true, message: "Photo deleted successfully" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete photo" };
  }
}

export async function reorderGalleryPhotosAction(orderedIds: string[]) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      await (supabase.from("gallery_items") as any)
        .update({ sort_order: index })
        .eq("id", id);
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");

    return { success: true, message: "Photos reordered successfully" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reorder photos" };
  }
}

export async function createGalleryVideoAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized: Admin authentication required",
      };
    }

    const title_bn = formData.get("title_bn") as string;
    const title_en = (formData.get("title_en") as string) || null;
    const youtube_url = formData.get("youtube_url") as string;
    const category = (formData.get("category") as VideoCategory) || "Events";

    if (!title_bn || title_bn.trim() === "") {
      return { success: false, error: "Bengali Title is required" };
    }

    if (!youtube_url || youtube_url.trim() === "") {
      return { success: false, error: "YouTube URL is required" };
    }

    const youtube_id = extractYouTubeId(youtube_url);
    if (!youtube_id) {
      return {
        success: false,
        error:
          "Invalid YouTube URL. Please provide a valid YouTube watch, short, or share link.",
      };
    }

    const { error: dbError } = await (
      supabase.from("gallery_videos") as any
    ).insert({
      title_bn,
      title_en,
      youtube_url,
      youtube_id,
      category,
      sort_order: 0,
      is_published: true,
    });

    if (dbError) {
      console.error("Database insert error for gallery video:", dbError);
      return {
        success: false,
        error: `Failed to add video: ${dbError.message}`,
      };
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath("/bn/gallery");
    revalidatePath("/en/gallery");

    return { success: true, message: "Video added successfully" };
  } catch (err: any) {
    console.error("Unexpected error in createGalleryVideoAction:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
}

export async function deleteGalleryVideoAction(id: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await (supabase.from("gallery_videos") as any)
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath("/bn/gallery");
    revalidatePath("/en/gallery");

    return { success: true, message: "Video deleted successfully" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete video" };
  }
}

export async function reorderGalleryVideosAction(orderedIds: string[]) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      await (supabase.from("gallery_videos") as any)
        .update({ sort_order: index })
        .eq("id", id);
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");

    return { success: true, message: "Videos reordered successfully" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reorder videos" };
  }
}
