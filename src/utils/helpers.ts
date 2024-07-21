export const buildPrefix = (mangaId: string, chapterId: string) => {
  return `manga-${mangaId}/chapter-${chapterId}/`;
};

export const sortByPageNumber = (a?: string, b?: string) => {
  if (!a || !b) return 0;
  const aNum = parseInt(a.split("/").pop()!.split(".")[0].split("-").pop()!);
  const bNum = parseInt(b.split("/").pop()!.split(".")[0].split("-").pop()!);
  return aNum - bNum;
};
