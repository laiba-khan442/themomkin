// 1. Get slug from URL
const slug = new URLSearchParams(window.location.search).get("slug");
console.log("Slug from URL:", slug);

// Optional: handle missing slug
if (!slug) {
  console.error("Fetch or parsing error:", err);
  document.body.innerHTML = "<h2>Debug: failed to load blog data1</h2>";
}

// 2. Fetch JSON data
fetch("data/blogs.json")
  .then(res => res.json())
  .then(data => {
    // 3. Find matching post
    const post = data.posts.find(p => p.slug === slug);

    if (!post) {
      console.error("Fetch or parsing error:", err);
      document.body.innerHTML = "<h2>Debug: failed to load blog data2</h2>";
    }

    // 4. Inject content
    document.getElementById("page-title").textContent = post.title;
    document.getElementById("post-title").textContent = post.title;
   // document.getElementById("post-date").textContent = post.date;
   // document.getElementById("post-image").src = post.image;
  //  document.getElementById("post-image").alt = post.title;
    document.getElementById("post-content").innerHTML = post.content;
  })
  .catch(err => {
    console.error("Fetch or parsing error:", err);
  document.body.innerHTML = "<h2>Debug: failed to load blog data3</h2>";
  });