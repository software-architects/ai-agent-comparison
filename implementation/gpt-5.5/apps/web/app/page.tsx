import { AdditionVisualizer } from "@add-demo/lib";

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <h1 id="page-title">Add Two Numbers</h1>
        <AdditionVisualizer />
      </section>
    </main>
  );
}
