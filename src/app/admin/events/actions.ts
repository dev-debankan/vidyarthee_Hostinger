"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  EventCategory,
  validateImageBuffer,
  generateEventStoragePath,
  generateEventSlug,
} from "@/lib/events/validation";

export async function createEventAction(formData: FormData) {
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
    const category =
      (formData.get("category") as EventCategory) || "Educational";
    const description_bn = formData.get("description_bn") as string;
    const description_en = (formData.get("description_en") as string) || null;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const location = formData.get("location") as string;
    const is_published = formData.get("is_published") !== "false";

    if (!title_bn || title_bn.trim() === "") {
      return { success: false, error: "Bengali Title is required" };
    }

    if (!description_bn || description_bn.trim() === "") {
      return { success: false, error: "Bengali Description is required" };
    }

    if (!date) {
      return { success: false, error: "Event Date is required" };
    }

    if (!time || time.trim() === "") {
      return { success: false, error: "Event Time is required" };
    }

    if (!location || location.trim() === "") {
      return { success: false, error: "Location/Venue is required" };
    }

    let cover_image_url: string | null = null;
    const imageFile = formData.get("cover_image") as File | null;

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const validation = validateImageBuffer(buffer, imageFile.name);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const storagePath = generateEventStoragePath(
        validation.sanitizedFilename!,
      );
      const { error: uploadError } = await supabase.storage
        .from("site-photos")
        .upload(storagePath, buffer, {
          contentType: validation.mimeType,
          upsert: true,
        });

      if (uploadError) {
        console.error("Event cover upload error:", uploadError);
        return {
          success: false,
          error: `Failed to upload image: ${uploadError.message}`,
        };
      }

      const { data: publicUrlData } = supabase.storage
        .from("site-photos")
        .getPublicUrl(storagePath);

      cover_image_url = publicUrlData.publicUrl;
    }

    const slug = generateEventSlug(title_bn, title_en);

    const { error: dbError } = await (supabase.from("events") as any).insert({
      slug,
      title_bn,
      title_en,
      category,
      description_bn,
      description_en,
      date,
      time,
      location,
      cover_image_url,
      is_published,
    });

    if (dbError) {
      console.error("Database insert error for event:", dbError);
      return {
        success: false,
        error: `Failed to create event: ${dbError.message}`,
      };
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath("/");
    revalidatePath("/bn/events");
    revalidatePath("/en/events");

    return { success: true, message: "Event created successfully" };
  } catch (err: any) {
    console.error("Unexpected error in createEventAction:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
}

export async function updateEventAction(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const title_bn = formData.get("title_bn") as string;
    const title_en = (formData.get("title_en") as string) || null;
    const category =
      (formData.get("category") as EventCategory) || "Educational";
    const description_bn = formData.get("description_bn") as string;
    const description_en = (formData.get("description_en") as string) || null;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const location = formData.get("location") as string;
    const is_published =
      formData.get("is_published") === "true" ||
      formData.get("is_published") === "on";

    if (!title_bn || title_bn.trim() === "") {
      return { success: false, error: "Bengali Title is required" };
    }

    const { data: existingEvent } = await (supabase.from("events") as any)
      .select("*")
      .eq("id", id)
      .single();

    let cover_image_url = existingEvent?.cover_image_url || null;

    const imageFile = formData.get("cover_image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const validation = validateImageBuffer(buffer, imageFile.name);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const storagePath = generateEventStoragePath(
        validation.sanitizedFilename!,
      );
      const { error: uploadError } = await supabase.storage
        .from("site-photos")
        .upload(storagePath, buffer, {
          contentType: validation.mimeType,
          upsert: true,
        });

      if (uploadError) {
        return {
          success: false,
          error: `Failed to upload image: ${uploadError.message}`,
        };
      }

      const { data: publicUrlData } = supabase.storage
        .from("site-photos")
        .getPublicUrl(storagePath);

      cover_image_url = publicUrlData.publicUrl;
    }

    const { error: updateError } = await (supabase.from("events") as any)
      .update({
        title_bn,
        title_en,
        category,
        description_bn,
        description_en,
        date,
        time,
        location,
        cover_image_url,
        is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return {
        success: false,
        error: `Failed to update event: ${updateError.message}`,
      };
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath("/");
    revalidatePath("/bn/events");
    revalidatePath("/en/events");

    return { success: true, message: "Event updated successfully" };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred",
    };
  }
}

export async function deleteEventAction(id: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await (supabase.from("events") as any)
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath("/");

    return { success: true, message: "Event deleted successfully" };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete event" };
  }
}

export async function togglePublishEventAction(
  id: string,
  currentStatus: boolean,
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await (supabase.from("events") as any)
      .update({
        is_published: !currentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath("/");

    return {
      success: true,
      message: !currentStatus ? "Event published" : "Event unpublished",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to update publish state",
    };
  }
}
