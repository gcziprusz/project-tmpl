package com.nashss.se.musicplaylistservice.activity;

import com.nashss.se.musicplaylistservice.activity.requests.SearchPlaylistsRequest;
import com.nashss.se.musicplaylistservice.activity.results.SearchPlaylistsResult;
import com.nashss.se.musicplaylistservice.converters.ModelConverter;
import com.nashss.se.musicplaylistservice.dynamodb.PlaylistDao;
import com.nashss.se.musicplaylistservice.dynamodb.models.Playlist;
import com.nashss.se.musicplaylistservice.models.PlaylistModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.inject.Inject;
import java.util.List;

import static com.nashss.se.musicplaylistservice.utils.NullUtils.ifNull;

/**
 * Implementation of the GetPlaylistActivity for the MusicPlaylistService's GetPlaylist API.
 *
 * This API allows the customer to get one of their saved playlists.
 */
public class SearchPlaylistsActivity {
    private final Logger log = LogManager.getLogger();
    private final PlaylistDao playlistDao;

    /**
     * Instantiates a new GetPlaylistActivity object.
     *
     * @param playlistDao PlaylistDao to access the playlist table.
     */
    @Inject
    public SearchPlaylistsActivity(PlaylistDao playlistDao) {
        this.playlistDao = playlistDao;
    }

    /**
     * This method handles the incoming request by retrieving the playlist from the database.
     * <p>
     * It then returns the playlist.
     * <p>
     * If the playlist does not exist, this should throw a PlaylistNotFoundException.
     *
     * @param searchPlaylistsRequest request object containing the playlist ID
     * @return getPlaylistResult result object containing the API defined {@link PlaylistModel}
     */
    public SearchPlaylistsResult handleRequest(final SearchPlaylistsRequest searchPlaylistsRequest) {
        log.info("Received SearchPlaylistsRequest {}", searchPlaylistsRequest);

        String[] criteria = ifNull(searchPlaylistsRequest.getCriteria(), "").split("\\s");

        List<Playlist> results = playlistDao.searchPlaylists(criteria);
        List<PlaylistModel> playlistModels = new ModelConverter().toPlaylistModelList(results);

        return SearchPlaylistsResult.builder()
                .withPlaylists(playlistModels)
                .build();
    }
}
