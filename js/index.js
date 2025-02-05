fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    const commentsContainer = document.getElementById('comments');

    // Fungsi untuk membuat elemen komentar atau balasan
    function createCommentElement(comment, isReply = false) {
      const commentElement = document.createElement('div');
      commentElement.classList.add('p-6', 'bg-white', 'rounded-lg', 'shadow', 'mb-4', 'comment');
      if (isReply) {
        commentElement.classList.add('max-md:ml-0', 'ml-12', 'mt-4', 'bg-gray-50');
      }

      const isJuliosomo = comment.user.username === 'juliusomo';

      commentElement.innerHTML = `
        <div class="flex items-start relative">
          <div class="flex flex-col items-center mr-4 gap-3 max-md:absolute max-md:flex-row bottom-0 left-0 right-0 bg-Very-light-gray w-10 max-md:w-20 max-md:items-center max-md:justify-center rounded-full">
            <button class="text-gray-400 hover:text-Moderate-blue font-extrabold text-lg plus-btn">
              +
            </button>
            <span class="text-blue-600 font-semibold score">${comment.score}</span>
            <button class="text-gray-300 hover:text-Moderate-blue font-extrabold text-lg minus-btn cur" >
              -
            </button>
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <img src="${comment.user.image.png}" alt="${comment.user.username}" class="w-8 h-8 rounded-full">
                <span class="font-bold text-Dark-blue">${comment.user.username}</span>
                ${comment.user.username === 'juliusomo' ? `<span class="bg-Moderate-blue text-white px-2 py-1 text-xs">you</span>` : ''}
                <span class="text-gray-500 text-sm">${comment.createdAt}</span>
              </div>
              <!-- Tombol tindakan di atas komentar (Desktop) -->
              <div class="flex items-center space-x-3 hidden md:flex">
                ${isJuliosomo ? `
                  <button class="delete-btn hover:opacity-50 flex items-center space-x-1">
                    <img src="./images/icon-delete.svg" alt="Delete Icon" class="w-4 h-4">
                    <span class="font-bold text-Soft-Red">Delete</span>
                  </button>
                  <button class="edit-btn hover:opacity-50 flex items-center space-x-1">
                    <img src="./images/icon-edit.svg" alt="Edit Icon" class="w-4 h-4">
                    <span class="font-bold text-Moderate-blue">Edit</span>
                  </button>
                ` : `
                  <button class="reply-btn hover:opacity-50 flex items-center space-x-1" data-username="${comment.user.username}">
                    <img src="./images/icon-reply.svg" alt="Reply Icon" class="w-4 h-4">
                    <span class="font-bold text-Moderate-blue">Reply</span>
                  </button>
                `}
              </div>
            </div>
            <p class="text-gray-700 mt-3 comment-content">
              ${isReply ? `<span class="text-Moderate-blue font-bold text-sm">@${comment.replyingTo}</span>` : ''}
              ${comment.content}
            </p>

            <!-- Tombol tindakan di bawah komentar (Mobile) -->
            <div class="flex items-center justify-end space-x-3 mt-4 md:hidden">
              ${isJuliosomo ? `
                <div class="flex gap-3">
                  <button class="delete-btn text-Soft-Red hover:opacity-50 text-sm flex items-center space-x-1">
                    <img src="./images/icon-delete.svg" alt="Delete Icon" class="w-4 h-4">
                    <span class="font-bold text-Soft-Red">Delete</span>
                  </button>
                  <button class="edit-btn text-sm hover:opacity-50 flex items-center space-x-1">
                    <img src="./images/icon-edit.svg" alt="Edit Icon" class="w-4 h-4">
                    <span class="font-bold text-Moderate-blue">Edit</span>
                  </button>
                ` : `
                  <button class="reply-btn text-sm hover:opacity-50 flex items-center space-x-1" data-username="${comment.user.username}">
                    <img src="./images/icon-reply.svg" alt="Reply Icon" class="w-4 h-4">
                    <span class="font-bold text-Moderate-blue">Reply</span>
                  </button>
                </div>
                `}
                </div>
                </div>
                <div class="reply-input hidden mt-4 p-6 bg-white rounded-lg shadow flex flex-col md:flex-row items-start space-y-3 md:space-y-0 md:space-x-3">
                  <div class="hidden md:flex">
                    <img src="./images/avatars/image-juliusomo.png" alt="User Avatar" class="w-8 h-8 rounded-full">
                  </div>
                  <textarea class="flex-1 p-2 border border-gray-300 rounded-lg w-full" rows="2" placeholder="Add a reply..."></textarea>
                  <div class="flex justify-between items-center w-full md:w-auto">
                    <img src="./images/avatars/image-juliusomo.png" alt="User Avatar" class="w-8 h-8 rounded-full md:hidden">
                    <button class="send-reply px-4 py-2 bg-Moderate-blue hover:bg-opacity-50 text-white rounded-lg">REPLY</button>
                  </div>
                </div>
        </div>
        <div class="replies"></div>
      `;

      // Tombol + dan - dari elemen komentar
      const plusButtons = commentElement.querySelectorAll('.plus-btn');
      const minusButtons = commentElement.querySelectorAll('.minus-btn');
      const scoreDisplay = commentElement.querySelector('.score'); // Elemen skor

      let plusClicked = false;

      plusButtons.forEach(plusBtn => {
        plusBtn.addEventListener('click', () => {
          if (!plusClicked) {
            comment.score += 1; // Tambahkan skor
            scoreDisplay.textContent = comment.score; // Perbarui tampilan skor
            plusClicked = true;
            plusButtons.forEach(btn => btn.disabled = true); // Nonaktifkan semua tombol plus
            minusButtons.forEach(btn => btn.disabled = false); // Aktifkan semua tombol minus
          }
        });
      });

      minusButtons.forEach(minusBtn => {
        minusBtn.addEventListener('click', () => {
          if (plusClicked) {
            comment.score -= 1; // Kurangi skor
            scoreDisplay.textContent = comment.score; // Perbarui tampilan skor
            plusClicked = false;
            minusButtons.forEach(btn => btn.disabled = true); // Nonaktifkan semua tombol minus
            plusButtons.forEach(btn => btn.disabled = false); // Aktifkan semua tombol plus
          }
        });
      });
      return commentElement;
    }

    // Referensi elemen modal dan tombol
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');

    let commentToDelete = null; // Variabel untuk menyimpan elemen komentar sementara

    // Event listener untuk tombol delete pada komentar
    commentsContainer.addEventListener('click', (event) => {
      if (event.target.closest('.delete-btn')) {
        // Simpan elemen komentar yang akan dihapus
        commentToDelete = event.target.closest('.comment');
        
        // Tampilkan modal konfirmasi
        deleteModal.classList.remove('hidden');
      }
    });

    // Event listener untuk tombol "Confirm Delete" di modal
    confirmDeleteBtn.addEventListener('click', () => {
      if (commentToDelete) {
        commentToDelete.remove(); // Hapus komentar
        commentToDelete = null; // Reset variabel
      }
      
      // Sembunyikan modal setelah menghapus komentar
      deleteModal.classList.add('hidden');
    });

    // Event listener untuk tombol "Cancel" di modal
    cancelDeleteBtn.addEventListener('click', () => {
      // Sembunyikan modal tanpa menghapus komentar
      deleteModal.classList.add('hidden');
      commentToDelete = null;
    });

    // Delegasi event untuk menangani semua tombol di dalam komentar
    commentsContainer.addEventListener('click', (event) => {
      if (event.target.closest('.reply-btn')) {
        // Tampilkan input balasan
        const commentElement = event.target.closest('.comment');
        const replyInput = commentElement.querySelector('.reply-input');
        replyInput.classList.toggle('hidden');
        replyInput.querySelector('textarea').focus();
      } else if (event.target.closest('.send-reply')) {
        // Kirim balasan
        const commentElement = event.target.closest('.comment');
        const replyText = commentElement.querySelector('textarea').value.trim();
        if (replyText) {
          const newReply = {
            content: replyText,
            createdAt: "Just now",
            score: 0,
            replyingTo: commentElement.querySelector('.reply-btn').dataset.username,
            user: {
              image: { png: "./images/avatars/image-juliusomo.png" },
              username: "juliusomo"
            }
          };
          const replyElement = createCommentElement(newReply, true);
          commentElement.querySelector('.replies').appendChild(replyElement);
          commentElement.querySelector('.reply-input').classList.add('hidden');
          commentElement.querySelector('textarea').value = '';
        }
      } else if (event.target.closest('.edit-btn')) {
        // Edit komentar
        const commentElement = event.target.closest('.comment');
        const contentElement = commentElement.querySelector('.comment-content');
        const currentText = contentElement.innerText;
        contentElement.innerHTML = `
          <textarea class="edit-textarea w-full p-2 border border-gray-300 rounded-lg">${currentText}</textarea>
          <div class="text-right mt-2">
            <button class="save-edit px-4 py-2 bg-Moderate-blue hover:bg-opacity-50 text-white rounded-lg">UPDATE</button>
          </div>
        `;
        contentElement.querySelector('.save-edit').addEventListener('click', () => {
          const newText = contentElement.querySelector('.edit-textarea').value.trim();
          if (newText) {
            contentElement.innerHTML = newText;
          }
        });
      }
    });

    // Tambah komentar baru
    document.querySelector('.send-comment').addEventListener('click', () => {
      const commentText = document.querySelector('.add-comment textarea').value.trim();
      if (commentText) {
        const newComment = {
          content: commentText,
          createdAt: "Just now",
          score: 0,
          user: {
            image: { png: "./images/avatars/image-juliusomo.png" },
            username: "juliusomo"
          }
        };
        const newCommentElement = createCommentElement(newComment);
        commentsContainer.appendChild(newCommentElement);
        document.querySelector('.add-comment textarea').value = '';
      }
    });

    // Loop untuk menampilkan komentar dan balasan
    data.comments.forEach(comment => {
      const commentElement = createCommentElement(comment);
      commentsContainer.appendChild(commentElement);
      comment.replies.forEach(reply => {
        const replyElement = createCommentElement(reply, true);
        commentElement.querySelector('.replies').appendChild(replyElement);
      });
    });
  })
  .catch(error => console.error('Error loading JSON:', error));
