import { AdditionVisualizer } from "../components/addition-visualizer"

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Add Two Numbers</h1>
      <AdditionVisualizer />
    </main>
  )
}
