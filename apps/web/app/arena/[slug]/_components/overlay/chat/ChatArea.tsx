import { useCallback, useEffect, useRef } from "react";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from '@tanstack/react-virtual';
import { User } from "better-auth";
import { Message } from "@repo/schemas/arena-ws-events";
import { MessagePage } from "@/lib/validators/chat";
import MessageBubble from './MessageBubble';
import { Spinner } from "@/components/ui/spinner";
import { MdErrorOutline } from "react-icons/md";

interface ChatAreaProps {
  infiniteQuery: ReturnType<typeof useInfiniteQuery<MessagePage, Error, InfiniteData<MessagePage, number>>>;
  allMessages: Message[];
  user: User;
}

export default function ChatArea({ infiniteQuery, allMessages, user }: ChatAreaProps) {

  const parentRef = useRef<HTMLDivElement>(null);
  const hasScrolledToBottom = useRef<boolean>(false);
  const prevMessageCount = useRef<number>(allMessages.length);
  const lastMessageLoadTime = useRef<number>(0);
  const isScrollingToBottom = useRef<boolean>(false);
  const wasAtBottom = useRef<boolean>(true);
  const isAdjustingScroll = useRef<boolean>(false);
  const isLoadingPrevious = useRef<boolean>(false);

  const {
    status,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = infiniteQuery;

  const rowVirtualizer = useVirtualizer({
    count: allMessages.length,
    getScrollElement: useCallback(() => parentRef.current, []),
    estimateSize: useCallback((index: number) => {
      const message = allMessages[index];
      if (!message?.content) return 45;

      const lines = (message.content.match(/\n/g) || []).length;
      const baseHeight = 45;
      return baseHeight + (lines * 20); // 2px per line break
    }, [allMessages]), // estimated height of each row in pixels
    overscan: 10, // items to render above and below the visible area
    gap: 8, // gap between items in pixels
  })

  // track if user is at bottom 
  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const handleScroll = () => {
      // don't update if manual scroll
      if (isScrollingToBottom.current) return;

      const { scrollTop, scrollHeight, clientHeight } = parent;
      // Check if scroll near the bottom
      const atBottom = scrollHeight - scrollTop - clientHeight < 50;
      wasAtBottom.current = atBottom;
    };

    parent.addEventListener('scroll', handleScroll);
    return () => parent.removeEventListener('scroll', handleScroll);
  }, [parentRef]);

  // Initial scroll to bottom
  useEffect(() => {
    if (!parentRef.current) return;
    if (allMessages.length === 0) return;

    // first load
    if (prevMessageCount.current === 0) {
      isScrollingToBottom.current = true;
      rowVirtualizer.scrollToIndex(allMessages.length - 1, {
        align: 'end',
      });

      const timer = setTimeout(() => {
        hasScrolledToBottom.current = true;
        isScrollingToBottom.current = false;
        wasAtBottom.current = true;
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [allMessages.length, rowVirtualizer]);

  // handle scroll position with new message addition
  useEffect(() => {
    const currentCount = allMessages.length;
    const previousCount = prevMessageCount.current;
    const countChange = currentCount - previousCount;

    if (countChange === 0) return;

    // check if we just finished loading old messages
    if (isLoadingPrevious.current && countChange > 0) {
      // maintain scroll position
      isLoadingPrevious.current = false;
      isAdjustingScroll.current = true;

      const virtualItems = rowVirtualizer.getVirtualItems();
      if (virtualItems.length > 0 && virtualItems[0]) {
        const currentFirstVisibleIndex = virtualItems[0].index;
        requestAnimationFrame(() => {
          rowVirtualizer.scrollToIndex(currentFirstVisibleIndex + countChange, {
            align: 'start',
            behavior: 'auto',
          });
          setTimeout(() => {
            isAdjustingScroll.current = false;
          }, 100);
        });
      } else {
        isAdjustingScroll.current = false;
      }
    }
    // check new message added (not from scroll)
    else if (countChange > 0) {
      // Only scroll to bottom if user was already at the bottom
      if (wasAtBottom.current) {
        isScrollingToBottom.current = true;
        rowVirtualizer.scrollToIndex(currentCount - 1, {
          align: 'end',
          behavior: 'smooth',
        });

        setTimeout(() => {
          isScrollingToBottom.current = false;
        }, 100);
      }
    }

    prevMessageCount.current = currentCount;
  }, [allMessages.length, rowVirtualizer]);

  // check if user reached top
  useEffect(() => {
    if (!hasScrolledToBottom.current || isFetchingNextPage || isAdjustingScroll.current) return;

    const [first] = rowVirtualizer.getVirtualItems();
    if (!first) return;

    const now = Date.now();
    if (now - lastMessageLoadTime.current < 500) return;

    if (first.index <= 0 && hasNextPage) {
      lastMessageLoadTime.current = now;
      isLoadingPrevious.current = true;
      fetchNextPage();
    }
  }, [rowVirtualizer.getVirtualItems(), hasNextPage, fetchNextPage, isFetchingNextPage]);


  if (status === "pending") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Spinner />
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    console.error(error.message);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2 max-w-md text-center">
          <MdErrorOutline />
          <p className="text-destructive font-medium">Error loading messages</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="flex-1 w-full overflow-auto min-h-0 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent"
    >
      <div
        className="relative w-full"
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {isFetchingNextPage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-background/95 backdrop-blur-sm border rounded-full px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Spinner />
                <p className="text-sm text-muted-foreground">Loading older messages</p>
              </div>
            </div>
          </div>
        )}
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const message = allMessages[virtualRow.index]
          if (!message) return null;
          return (
            <div
              key={message.id || virtualRow.index}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              className="w-full absolute top-0 left-0"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <MessageBubble message={message} user={user} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
