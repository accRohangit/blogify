document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const blogPostsSection = document.getElementById('blogPostsSection');
    const newPostSection = document.getElementById('newPostSection');
    const aboutSection = document.getElementById('aboutSection');
    const postsContainer = document.getElementById('postsContainer');

    const homeLink = document.getElementById('homeLink');
    const newPostLink = document.getElementById('newPostLink');
    const aboutLink = document.getElementById('aboutLink');

    const postForm = document.getElementById('postForm');
    const formTitle = document.getElementById('formTitle');
    const postIdInput = document.getElementById('postId');
    const postTitleInput = document.getElementById('postTitle');
    const postAuthorInput = document.getElementById('postAuthor');
    const postContentInput = document.getElementById('postContent');
    const mediaTypeInput = document.getElementById('mediaType');
    const mediaUrlInput = document.getElementById('mediaUrl');
    const submitPostBtn = document.getElementById('submitPostBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    const postSearchInput = document.getElementById('postSearch');
    const searchButton = document.getElementById('searchButton');

    // --- Data Storage (using Local Storage) ---
    let blogPosts = [];

    // --- Helper Functions ---

    /**
     * Loads blog posts from Local Storage or uses initial dummy data.
     */
    function loadPosts() {
        const storedPosts = localStorage.getItem('blogPosts');
        if (storedPosts) {
            blogPosts = JSON.parse(storedPosts);
        } else {
            // Initial dummy data if no posts in Local Storage
            blogPosts = [
                {
                    id: 1,
                    title: "Getting Started with Web Development",
                    author: "Alice Smith",
                    date: "2025-05-20",
                    content: "Web development is an exciting field that involves building websites and web applications. It typically involves three main areas: front-end (what users see and interact with), back-end (server-side logic and databases), and database management. To get started, you'll want to learn HTML for structure, CSS for styling, and JavaScript for interactivity. Many online resources and courses are available to help you on your journey. Don't be afraid to experiment and build small projects to solidify your understanding. The web is constantly evolving, so continuous learning is key!",
                    media: { type: "image", url: "https://via.placeholder.com/800x400/8FBC8F/FFFFFF?Text=HTML+CSS+JS" }
                },
                {
                    id: 2,
                    title: "The Power of CSS Flexbox for Layouts",
                    author: "Bob Johnson",
                    date: "2025-05-22",
                    content: "CSS Flexbox is a one-dimensional layout method for arranging items in rows or columns. It's incredibly powerful for creating responsive designs and distributing space among items in a container. With properties like `justify-content`, `align-items`, `flex-grow`, and `flex-shrink`, you can control the alignment, sizing, and order of your elements with remarkable flexibility. Understanding Flexbox is a game-changer for modern web design, simplifying many layout challenges that were once complex with traditional CSS floats and positioning. It makes centering items a breeze!",
                    media: { type: "image", url: "https://via.placeholder.com/800x400/A2D2FF/000000?Text=Flexbox+Layout" }
                },
                {
                    id: 3,
                    title: "Understanding JavaScript Closures: A Deep Dive",
                    author: "Charlie Brown",
                    date: "2025-05-25",
                    content: "A closure in JavaScript is a function that has access to its outer function's scope even after the outer function has finished executing. This concept is fundamental to many advanced JavaScript patterns, including module patterns and private variables. Closures allow you to create functions that 'remember' their environment, making them incredibly useful for data encapsulation and creating more robust, maintainable code. While initially a bit tricky to grasp, mastering closures opens up a new world of possibilities in JavaScript programming. They are often used in event handlers and callbacks.",
                    media: { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" } // Example video
                },
                {
                    id: 4,
                    title: "Modern JavaScript Features You Should Know",
                    author: "Diana Prince",
                    date: "2025-05-26",
                    content: "ECMAScript 6 (ES6) and later versions introduced many powerful features to JavaScript, making the language more expressive and enjoyable to write. These include arrow functions for concise syntax, template literals for easier string manipulation, destructuring assignment for extracting values from arrays and objects, and Promises/async-await for handling asynchronous operations more cleanly. Keeping up with these modern features is crucial for writing efficient and maintainable JavaScript code in today's development landscape. Embracing them will significantly improve your productivity.",
                    media: null // No media for this post
                }
            ];
            savePosts(); // Save dummy data to local storage
        }
    }

    /**
     * Saves the current blogPosts array to Local Storage.
     */
    function savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    }

    /**
     * Shows a specific section and hides others.
     * @param {HTMLElement} sectionToShow - The section to display.
     */
    function showSection(sectionToShow) {
        blogPostsSection.classList.add('hidden');
        newPostSection.classList.add('hidden');
        aboutSection.classList.add('hidden');
        sectionToShow.classList.remove('hidden');
    }

    /**
     * Renders blog posts to the DOM.
     * @param {Array} postsToRender - The array of post objects to display.
     */
    function renderPosts(postsToRender) {
        postsContainer.innerHTML = ''; // Clear existing posts

        if (postsToRender.length === 0) {
            postsContainer.innerHTML = '<p>No posts found. Why not create one?</p>';
            return;
        }

        postsToRender.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('blog-post');
            postElement.dataset.postId = post.id; // Store ID for easy access

            let mediaElement = '';
            if (post.media && post.media.url) {
                if (post.media.type === 'image') {
                    mediaElement = `<img src="${post.media.url}" alt="${post.title}" loading="lazy">`;
                } else if (post.media.type === 'video') {
                    mediaElement = `<video controls><source src="${post.media.url}" type="video/mp4">Your browser does not support the video tag.</video>`;
                }
            }

            // Limit content for initial display
            const previewLength = 250; // characters
            const isLongPost = post.content.length > previewLength;
            const displayedContent = isLongPost ? post.content.substring(0, previewLength) + '...' : post.content;

            postElement.innerHTML = `
                <div class="post-actions">
                    <button class="edit-btn" data-id="${post.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn" data-id="${post.id}"><i class="fas fa-trash-alt"></i> Delete</button>
                </div>
                <h3>${post.title}</h3>
                <p class="post-meta">By ${post.author} on ${post.date}</p>
                ${mediaElement}
                <p class="post-content">${displayedContent}</p>
                ${isLongPost ? '<button class="read-more-btn">Read More</button>' : ''}
            `;
            postsContainer.appendChild(postElement);
        });

        // Attach event listeners for "Read More", "Edit", and "Delete"
        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', toggleReadMore);
        });
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', editPost);
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', deletePost);
        });
    }

    /**
     * Toggles the "Read More" and "Show Less" functionality.
     * @param {Event} event - The click event.
     */
    function toggleReadMore(event) {
        const button = event.target;
        const postContentElement = button.previousElementSibling; // The <p> with class post-content

        const postId = button.closest('.blog-post').dataset.postId;
        const post = blogPosts.find(p => p.id == postId); // Use == for comparison as dataset.postId is string

        if (!post) return;

        if (postContentElement.classList.contains('expanded')) {
            // Collapse
            const previewLength = 250;
            postContentElement.textContent = post.content.substring(0, previewLength) + '...';
            postContentElement.classList.remove('expanded');
            button.textContent = 'Read More';
        } else {
            // Expand
            postContentElement.textContent = post.content;
            postContentElement.classList.add('expanded');
            button.textContent = 'Show Less';
        }
    }

    /**
     * Handles adding or updating a post from the form.
     * @param {Event} event - The form submission event.
     */
    function handlePostFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission (page reload)

        const id = postIdInput.value;
        const title = postTitleInput.value.trim();
        const author = postAuthorInput.value.trim();
        const content = postContentInput.value.trim();
        const mediaType = mediaTypeInput.value;
        const mediaUrl = mediaUrlInput.value.trim();

        if (title && author && content) {
            let media = null;
            if (mediaType && mediaUrl) {
                media = { type: mediaType, url: mediaUrl };
            }

            if (id) {
                // Editing an existing post
                const postIndex = blogPosts.findIndex(p => p.id == id);
                if (postIndex > -1) {
                    blogPosts[postIndex] = {
                        ...blogPosts[postIndex], // Keep existing properties
                        title: title,
                        author: author,
                        content: content,
                        media: media
                    };
                }
            } else {
                // Adding a new post
                const newPost = {
                    id: blogPosts.length > 0 ? Math.max(...blogPosts.map(p => p.id)) + 1 : 1, // Simple ID generation
                    title: title,
                    author: author,
                    date: new Date().toISOString().split('T')[0], // Current date (YYYY-MM-DD)
                    content: content,
                    media: media
                };
                blogPosts.unshift(newPost); // Add to the beginning of the array
            }

            savePosts(); // Save changes to local storage
            renderPosts(blogPosts); // Re-render all posts
            postForm.reset(); // Clear the form
            postIdInput.value = ''; // Clear hidden ID
            formTitle.textContent = 'Create New Post'; // Reset form title
            submitPostBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish Post'; // Reset button text
            cancelEditBtn.classList.add('hidden'); // Hide cancel button
            showSection(blogPostsSection); // Go back to blog posts view
        } else {
            alert('Please fill in all required fields (Title, Author, Content) to create/update a post.');
        }
    }

    /**
     * Populates the form with post data for editing.
     * @param {Event} event - The click event from the edit button.
     */
    function editPost(event) {
        const idToEdit = parseInt(event.target.dataset.id);
        const post = blogPosts.find(p => p.id === idToEdit);

        if (post) {
            postIdInput.value = post.id;
            postTitleInput.value = post.title;
            postAuthorInput.value = post.author;
            postContentInput.value = post.content;

            if (post.media) {
                mediaTypeInput.value = post.media.type;
                mediaUrlInput.value = post.media.url;
            } else {
                mediaTypeInput.value = '';
                mediaUrlInput.value = '';
            }

            formTitle.textContent = 'Edit Post';
            submitPostBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            cancelEditBtn.classList.remove('hidden'); // Show cancel button
            showSection(newPostSection); // Navigate to the form section
        }
    }

    /**
     * Deletes a post.
     * @param {Event} event - The click event from the delete button.
     */
    function deletePost(event) {
        const idToDelete = parseInt(event.target.dataset.id);
        if (confirm('Are you sure you want to delete this post?')) {
            blogPosts = blogPosts.filter(post => post.id !== idToDelete);
            savePosts(); // Save updated array to local storage
            renderPosts(blogPosts); // Re-render posts
        }
    }

    /**
     * Filters blog posts based on the search query.
     */
    function filterPosts() {
        const searchTerm = postSearchInput.value.toLowerCase().trim();
        const filtered = blogPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.author.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm)
        );
        renderPosts(filtered);
    }

    /**
     * Resets the post form to its default 'Create New Post' state.
     */
    function resetForm() {
        postForm.reset();
        postIdInput.value = '';
        formTitle.textContent = 'Create New Post';
        submitPostBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publish Post';
        cancelEditBtn.classList.add('hidden');
    }

    // --- Event Listeners ---

    homeLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(blogPostsSection);
        renderPosts(blogPosts); // Always re-render all posts when going home
        postSearchInput.value = ''; // Clear search on home
    });

    newPostLink.addEventListener('click', (event) => {
        event.preventDefault();
        resetForm(); // Ensure form is clean for new post
        showSection(newPostSection);
    });

    aboutLink.addEventListener('click', (event) => {
        event.preventDefault();
        showSection(aboutSection);
    });

    postForm.addEventListener('submit', handlePostFormSubmit);
    cancelEditBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent form submission
        resetForm();
        showSection(blogPostsSection); // Go back to post list
    });


    searchButton.addEventListener('click', filterPosts);
    postSearchInput.addEventListener('keyup', (event) => {
        // Trigger search on Enter key press
        if (event.key === 'Enter') {
            filterPosts();
        } else if (postSearchInput.value === '' && event.key !== 'Backspace' && event.key !== 'Delete') {
             // If input is cleared by typing nothing (not backspace/delete), re-render all posts
             // This gives a live search feel when clearing the input.
            renderPosts(blogPosts);
        }
    });


    // --- Initial Load ---
    loadPosts(); // Load posts from local storage
    renderPosts(blogPosts); // Display them
    showSection(blogPostsSection); // Show the blog posts section by default
});