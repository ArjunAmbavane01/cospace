import { useCallback, useEffect, useRef } from "react";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from '@tanstack/react-virtual';
import { Message, MessagePage } from "@/lib/validators/chat";
import { User } from "better-auth";
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
  const isAdjustingScroll = useRef<boolean>(false);
  const lastMessageLoadTime = useRef<number>(0);

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
      if (!message?.content) return 60;

      const lines = (message.content.match(/\n/g) || []).length;
      const baseHeight = 60;
      return baseHeight + (lines * 20); // 2px per line break
    }, [allMessages]), // estimated height of each row in pixels
    overscan: 20, // items to render above and below the visible area
    gap: 3, // gap between items in pixels
  })

  // Initial scroll to bottom
  useEffect(() => {
    if (!parentRef.current) return;
    if (allMessages.length === 0) return;
    if (prevMessageCount.current === 0) {
      rowVirtualizer.scrollToIndex(allMessages.length - 1, {
        align: 'end',
      });

      const timer = setTimeout(() => {
        hasScrolledToBottom.current = true;
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [allMessages.length, rowVirtualizer]);

  // handle scroll position
  useEffect(() => {
    const currentCount = allMessages.length;
    const previousCount = prevMessageCount.current;

    if (currentCount > previousCount && previousCount > 0) {
      const newMessagesCount = currentCount - previousCount;

      isAdjustingScroll.current = true;
      // get current scroll position
      const virtualItems = rowVirtualizer.getVirtualItems();
      if (virtualItems.length > 0 && virtualItems[0]) {
        const currentFirstVisibleIndex = virtualItems[0].index;
        requestAnimationFrame(() => {
          rowVirtualizer.scrollToIndex(currentFirstVisibleIndex + newMessagesCount, {
            align: 'start',
            behavior: 'auto',
          });
          setTimeout(() => {
            isAdjustingScroll.current = false;
          }, 100);
        });
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
      fetchNextPage();
    }
  }, [rowVirtualizer.getVirtualItems(), hasNextPage, fetchNextPage, isFetchingNextPage, allMessages.length]);


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
      className="flex-1 w-full overflow-auto min-h-0"
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
                <p className="text-sm text-muted-foreground">Loading older messages...</p>
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
