async function getUserInfo() {
    const username = document.getElementById('username').value;
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; // Clear previous results

    try {
       
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userResponse.json();

        if (userResponse.status === 404) {
            resultContainer.innerHTML = `<p>Invalid username: ${username}</p>`;
            return;
        }

       
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
        const reposData = await reposResponse.json();

        
        const userInfo = `
      <p><strong>Username:</strong> ${userData.login}</p>
      <p><strong>Name:</strong> ${userData.name || 'Not available'}</p>
      <p><strong>Bio:</strong> ${userData.bio || 'Not available'}</p>
      <p><strong>Location:</strong> ${userData.location || 'Not available'}</p>
      <p><strong>Email:</strong> ${userData.email || 'Not available'}</p>
      <p><strong>Company:</strong> ${userData.company || 'Not available'}</p>
      <p><strong>Public Repositories:</strong> ${userData.public_repos}</p>
      <p><strong>Followers:</strong> ${userData.followers}</p>
      <p><strong>Following:</strong> ${userData.following}</p>
      <p><strong>Created at:</strong> ${new Date(userData.created_at).toLocaleDateString()}</p>
      <p><strong>Updated at:</strong> ${new Date(userData.updated_at).toLocaleDateString()}</p>
    `;

        
        const repoTable = `
      <h2>Repositories:</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Language</th>
          </tr>
        </thead>
        <tbody>
          ${reposData.map(repo => `
            <tr>
              <td><a href="${repo.html_url}" target="_blank">${repo.name}</a></td>
              <td>${repo.description || 'Not available'}</td>
              <td>${repo.language || 'Not available'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

        resultContainer.innerHTML = userInfo + repoTable;
    } catch (error) {
        resultContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
