import { AdditionVisualizer } from "@add-demo/lib";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <h1 style={{ margin: 0 }}>Add Two Numbers</h1>
      <AdditionVisualizer />
    </main>
  );
}
