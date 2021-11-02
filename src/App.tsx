function App() {
  return (
    <div>
      <header>
        <div>Kanban board</div>

        <input placeholder="Filter cards" />
      </header>

      <div>
        <section>
          <h3>TODO</h3>

          <article>朝食をとる🍞</article>
          <article>SNSをチェックする🐦</article>
          <article>布団に入る (:3[___]</article>
        </section>

        <section>
          <h3>Doing</h3>

          <article>顔を洗う👐</article>
          <article>歯を磨く🦷</article>
        </section>

        <section>
          <h3>Waiting</h3>
        </section>

        <section>
          <h3>Done</h3>

          <article>布団から出る (:3っ)っ -=三[＿＿]</article>
        </section>
      </div>
    </div>
  )
}

export default App;
