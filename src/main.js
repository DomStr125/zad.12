import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lkpwcavcuktsunzdwipm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrcHdjYXZjdWt0c3VuemR3aXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTg4OTcsImV4cCI6MjA2MzIzNDg5N30.zXu--pxP7tAVInfxEYD6zFuSWfE2sg1bHgWL9J3gDyI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAndDisplayArticles() {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('title, subtitle, author, created_at, content');

  if (error) {
    document.body.innerHTML = `<p>Błąd: ${error.message}</p>`;
    return;
  }

  let html = '<h1>Lista artykułów</h1>';
  articles.forEach(article => {
    html += `
      <div style="border:1px solid #ccc; margin:10px; padding:10px;">
        <h2>${article.title}</h2>
        <h4>${article.subtitle}</h4>
        <p><b>Autor:</b> ${article.author}</p>
        <p><b>Data:</b> ${new Date(article.created_at).toLocaleDateString()}</p>
        <div>${article.content}</div>
      </div>
    `;
  });

  document.body.innerHTML = html;

html += `
    <h2>Dodaj nowy artykuł</h2>
    <form id="article-form">
      <input name="title" placeholder="Tytuł" required /><br/>
      <input name="subtitle" placeholder="Podtytuł" required /><br/>
      <input name="author" placeholder="Autor" required /><br/>
      <textarea name="content" placeholder="Treść" required></textarea><br/>
      <button type="submit">Dodaj artykuł</button>
    </form>
    <div id="form-message"></div>
  `;

  document.body.innerHTML = html;

  document.getElementById('article-form').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const { title, subtitle, author, content } = form;
    const { error } = await supabase.from('articles').insert([{
      title: title.value,
      subtitle: subtitle.value,
      author: author.value,
      content: content.value
    }]);
    const msgDiv = document.getElementById('form-message');
    if (error) {
      msgDiv.textContent = 'Błąd dodawania artykułu: ' + error.message;
    } else {
      msgDiv.textContent = 'Artykuł dodany!';
      form.reset();
      fetchAndDisplayArticles();
    }
  };
}

fetchAndDisplayArticles();