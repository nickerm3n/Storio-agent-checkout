export const checkoutPageContent = {
  badge: "PoC",
  title: "Checkout Agent Sandbox",
  subtitle:
    "Minimal React + Vite app for experimenting with agentic workflows.",
  cards: [
    {
      heading: "Current status",
      description:
        "Single-page view without routing. Next steps: plug in agent actions such as reading Jira issues and generating pull requests."
    },
    {
      heading: "Technical details",
      items: [
        "React 18 + TypeScript",
        "Vite as the build tool",
        "Ready to move into a separate repository"
      ]
    }
  ]
}

export function getCheckoutCard(heading) {
  return checkoutPageContent.cards.find((card) => card.heading === heading)
}
