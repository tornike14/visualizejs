"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Tells playback hooks which topic they belong to, so reaching the last step
 * can mark that topic as completed without each visualization knowing about
 * progress tracking at all.
 */
const TopicProgressContext = createContext<string | null>(null);

export const TopicProgressProvider = ({
  topicId,
  children,
}: {
  topicId: string;
  children: ReactNode;
}) => <TopicProgressContext value={topicId}>{children}</TopicProgressContext>;

export const useCurrentTopicId = () => useContext(TopicProgressContext);
