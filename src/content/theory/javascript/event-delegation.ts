import type { TopicTheoryContent } from "@/content/theory/types";

export const eventDelegationTheory: TopicTheoryContent = {
  summary:
    "DOM events propagate through the document tree in three phases: capture (down from the root), target (the clicked element), and bubble (back up). Event delegation uses bubbling to handle events from many children with a single parent listener.",

  whatItIs: [
    "Event propagation is the browser's mechanism for routing events through the DOM tree. When an interaction occurs, the browser builds a path from the document root to the target element. The event travels down this path during the capture phase, arrives at the target, then travels back up during the bubble phase.",
    "At each node along the path, the browser checks for registered event listeners. Listeners are registered for either the capture or bubble phase. The third argument to addEventListener (or the capture option) determines which phase the listener responds to. The default is the bubble phase.",
    "Event delegation is a pattern built on bubbling. Instead of attaching individual listeners to many child elements, you attach one listener to a common ancestor. When a child is clicked, the event bubbles up to the ancestor. The handler reads event.target to determine which child triggered the event and responds accordingly.",
  ],

  howItWorks: [
    "Step 1: the user interacts with an element. The browser identifies the deepest element under the pointer (the target) and constructs the propagation path from the document root down to the target.",
    "Step 2: the capture phase begins. The event visits each ancestor from the root toward the target. Any listener registered with { capture: true } fires at this point.",
    "Step 3: the event reaches the target element. This is the target phase. Both capture and bubble listeners on the target fire here.",
    "Step 4: the bubble phase begins. The event travels back up from the target to the root. Listeners registered for the bubble phase (the default) fire in order. stopPropagation() at any point halts further traversal.",
  ],

  commonMistakes: [
    {
      title: "Confusing event.target with event.currentTarget",
      explanation:
        "event.target is the element that triggered the event. event.currentTarget is the element the listener is attached to. With delegation, they are usually different.",
      fix: "Use event.target when you need to know what was clicked. Use event.currentTarget when you need the handler's host element.",
    },
    {
      title: "Using stopPropagation with delegation",
      explanation:
        "If a child calls stopPropagation(), the event never reaches the parent where the delegated handler lives. The delegation pattern breaks silently.",
      fix: "Avoid stopPropagation in child elements when a parent relies on delegation. If you must stop propagation, understand the full listener chain first.",
    },
    {
      title: "Delegating events that do not bubble",
      explanation:
        "Some events like focus, blur, and scroll do not bubble. A delegated handler on a parent will never fire for these events.",
      fix: "Use focusin and focusout instead of focus and blur. Check MDN to confirm an event bubbles before relying on delegation.",
    },
  ],

  interviewQuestions: [
    {
      question: "What are the three phases of DOM event propagation?",
      answer:
        "Capture (event travels from the document root down to the target), target (event reaches the clicked element), and bubble (event travels back up from the target to the root). Listeners default to the bubble phase unless { capture: true } is specified.",
    },
    {
      question: "What is event delegation and why is it useful?",
      answer:
        "Event delegation attaches a single event listener to a parent element instead of individual listeners on each child. It works because events bubble up. Benefits include fewer listeners (lower memory), automatic handling of dynamically added children, and simpler setup for lists and tables.",
    },
    {
      question:
        "What does stopPropagation() do and when should you use it?",
      answer:
        "stopPropagation() prevents the event from continuing to the next element in the propagation path. It does not prevent other listeners on the same element from firing (stopImmediatePropagation does that). Use it when a child component must handle an event exclusively and parent handlers should not react.",
    },
  ],

  relatedTopicIds: ["event-loop", "scope-chain", "closures", "execution-context"],
};
