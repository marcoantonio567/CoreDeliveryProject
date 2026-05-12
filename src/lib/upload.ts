import { supabase } from "@/integrations/supabase/client";

export async function uploadImages(userId: string, files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("uploads").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}
