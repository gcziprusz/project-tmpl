import MusicPlaylistClient from '../api/musicPlaylistClient';
import Header from '../components/header';
import BindingClass from "../util/bindingClass";
import DataStore from "../util/DataStore";

const SEARCH_CRITERIA_KEY = 'search-criteria';
const SEARCH_RESULTS_KEY = 'search-results';
const EMPTY_DATASTORE_STATE = {
    [SEARCH_CRITERIA_KEY]: '',
    [SEARCH_RESULTS_KEY]: [],
};

/**
 * Logic needed for the view playlist page of the website.
 */
class SearchPlaylists extends BindingClass {
    constructor() {
        super();
        this.bindClassMethods(['clientLoaded', 'mount', 'search', 'displaySearchResults', 'getHTMLForSearchResults', 'addPlaylistToPage', 'addSongsToPage', 'addSong'], this);

        // Create a enw datastore with an initial "empty" state.
        this.dataStore = new DataStore(EMPTY_DATASTORE_STATE);

        this.header = new Header(this.dataStore);
        this.dataStore.addChangeListener(this.displaySearchResults);
        console.log("searchPlaylists constructor");
    }

    /**
     * Once the client is loaded, get the playlist metadata and song list.
     */
    async clientLoaded() {
        /*
        const urlParams = new URLSearchParams(window.location.search);
        const playlistId = urlParams.get('id');
        document.getElementById('playlist-name').innerText = "Loading Playlist ...";
        const playlist = await this.client.getPlaylist(playlistId);
        this.dataStore.set('playlist', playlist);
        document.getElementById('songs').innerText = "(loading songs...)";
        const songs = await this.client.getPlaylistSongs(playlistId);
        this.dataStore.set('songs', songs);
        */
    }

    /**
     * Add the header to the page and load the MusicPlaylistClient.
     */
    mount() {
        document.getElementById('search-btn').addEventListener('click', this.search);
        this.header.addHeaderToPage();
        this.header.loadData();
        this.client = new MusicPlaylistClient();
        this.clientLoaded();
    }

    /**
     * Uses the client to perform the search, 
     * then updates the datastore with the criteria and results.
     */
    async search() {
        const searchCriteria = document.getElementById('search-criteria').value;
        if (searchCriteria) {
            this.dataStore.set(SEARCH_CRITERIA_KEY, searchCriteria);
            this.dataStore.set(SEARCH_RESULTS_KEY, [
                { name: 'A playlist', songCount: 2, tags: ['good', 'okay'] },
                { name: 'Another playlist', songCount: 3, tags: ['bad', 'ugly', 'good', 'okay'] },
            ])
        } else {
            this.dataStore.setState(EMPTY_DATASTORE_STATE);
        }
    }

    /**
     * Pulls search results from the datastore and displays them on the html page.
     */
    displaySearchResults() {
        const searchCriteria = this.dataStore.get(SEARCH_CRITERIA_KEY);
        const searchResults = this.dataStore.get(SEARCH_RESULTS_KEY);

        const searchResultsContainer = document.getElementById('search-results-container');
        const searchCriteriaDisplay = document.getElementById('search-criteria-display');
        const searchResultsDisplay = document.getElementById('search-results-display');

        if (searchCriteria === '') {
            searchResultsContainer.classList.add('hidden');
            searchCriteriaDisplay.innerHTML = '';
            searchResultsDisplay.innerHTML = '';
        } else {
            searchResultsContainer.classList.remove('hidden');
            searchCriteriaDisplay.innerHTML = searchCriteria;
            searchResultsDisplay.innerHTML = this.getHTMLForSearchResults(searchResults);
        }
    }

    getHTMLForSearchResults(searchResults) {
        if (searchResults.length === 0) {
            return '<h4>No results found</h4>';
        }

        let html = '<table><tr><th>Name</th><th>Song Count</th><th>Tags</th></tr>';
        for (const res of searchResults) {
            html += `
            <tr>
                <td>${res.name}</td><td>${res.songCount}</td><td>${res.tags.join(', ')}</td>
            </tr>`;
        }
        html += '</table>';

        return html;
    }

    /**
     * When the playlist is updated in the datastore, update the playlist metadata on the page.
     */
    addPlaylistToPage() {
        const playlist = this.dataStore.get('playlist');
        if (playlist == null) {
            return;
        }

        document.getElementById('playlist-name').innerText = playlist.name;

        let tagHtml = '';
        let tag;
        for (tag of playlist.tags) {
            tagHtml += '<div class="tag">' + tag + '</div>';
        }
        document.getElementById('tags').innerHTML = tagHtml;
    }

    /**
     * When the songs are updated in the datastore, update the list of songs on the page.
     */
    addSongsToPage() {
        const songs = this.dataStore.get('songs')

        if (songs == null) {
            return;
        }

        let songHtml = '';
        let song;
        for (song of songs) {
            songHtml += `
                <li class="song">
                    <span class="title">${song.title}</span>
                    <span class="album">${song.album}</span>
                </li>
            `;
        }
        document.getElementById('songs').innerHTML = songHtml;
    }

    /**
     * Method to run when the add song playlist submit button is pressed. Call the MusicPlaylistService to add a song to the
     * playlist.
     */
    async addSong() {
        const playlist = this.dataStore.get('playlist');
        if (playlist == null) {
            return;
        }

        document.getElementById('add-song').innerText = 'Adding...';
        const asin = document.getElementById('album-asin').value;
        const trackNumber = document.getElementById('track-number').value;
        const playlistId = playlist.id;

        const songList = await this.client.addSongToPlaylist(playlistId, asin, trackNumber);
        this.dataStore.set('songs', songList);

        document.getElementById('add-song').innerText = 'Add Song';
        document.getElementById("add-song-form").reset();
    }
}

/**
 * Main method to run when the page contents have loaded.
 */
const main = async () => {
    const searchPlaylists = new SearchPlaylists();
    searchPlaylists.mount();
};

window.addEventListener('DOMContentLoaded', main);
