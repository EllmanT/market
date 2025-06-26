'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  isNext: boolean;
  loadMore: (n: number) => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  containerClasses?: string;
}

const Pagination = ({ page = 1, isNext, containerClasses, loadMore, setPage }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = async (type: "prev" | "next") => {
    const newPage = type === "prev" ? page - 1 : page + 1;

    // Update the page in the URL (optional for bookmarking or shareable URLs)
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    router.push(`?${newParams.toString()}`);

    // Load more data if going to next page
    if (type === "next") {
      await loadMore(20); // same number as initialNumItems
    }

    setPage(newPage);
  };

  return (
    <div className={cn("flex w-full items-center justify-center gap-2 mt-5", containerClasses)}>
      {page > 1 && (
        <Button
          className="light-border items-center justify-center gap-2 border"
          onClick={() => handleNavigation("prev")}
        >
          <p className="body-medium">◀ Prev</p>
        </Button>
      )}

      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{page}</p>
      </div>

      {isNext && (
        <Button
          className="light-border items-center justify-center gap-2 border"
          onClick={() => handleNavigation("next")}
        >
          <p className="body-medium">Next ▶</p>
        </Button>
      )}
    </div>
  );
};

export default Pagination;
