"use client";

import { useSyncExternalStore } from "react";
import {
  getServerTopicProgress,
  readTopicProgress,
  subscribeTopicProgress,
  type TopicProgressMap,
} from "@/lib/progress/topicProgress";

/** Live view of which topics this browser has completed. */
export const useTopicProgress = (): TopicProgressMap =>
  useSyncExternalStore(
    subscribeTopicProgress,
    readTopicProgress,
    getServerTopicProgress,
  );

export const useIsTopicCompleted = (topicId: string): boolean =>
  Boolean(useTopicProgress()[topicId]);
