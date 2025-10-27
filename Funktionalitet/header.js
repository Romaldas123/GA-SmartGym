fetch('api.php')
  .then(res => res.json())
  .then(users => {
    const ul = document.getElementById('user-list');
    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = user.name;
      ul.appendChild(li);
    });
  })
  .catch(err => console.error("Fel vid hämtning:", err));
