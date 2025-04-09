const result = document.querySelector('.result')
const baseUrl = `${window.location.origin}/albums`

const fetchAlbums = async () => {
  try {
    const response = await fetch(baseUrl)
    const data = await response.json()

    // had to remove the other 'data.' in order for this to work
    const albums = data.map((album) => {
      return `<ul>
          <li>Artist: ${album.artist}</li>
          <li>Title: ${album.title}</li>
          <li>Year: ${album.year}</li>
          <li>Genre: ${album.genre}</li>
          <li>Tracks: ${album.tracks}</li>
        </ul>`
    })
    result.innerHTML = albums.join('')
  } catch (error) {
    console.log(error)
    result.innerHTML = `<div class="alert alert-danger">Could not fetch data</div>`
  }
}
fetchAlbums()