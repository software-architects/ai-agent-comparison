import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Addition Visualizer",
  description: "A demo app to visualize addition of two numbers"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
