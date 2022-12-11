package com.nashss.se.musicplaylistservice.activity;

import com.google.common.collect.Sets;
import com.nashss.se.musicplaylistservice.activity.requests.GetPlaylistRequest;
import com.nashss.se.musicplaylistservice.activity.requests.SearchPlaylistsRequest;
import com.nashss.se.musicplaylistservice.activity.results.GetPlaylistResult;
import com.nashss.se.musicplaylistservice.activity.results.SearchPlaylistsResult;
import com.nashss.se.musicplaylistservice.dynamodb.PlaylistDao;
import com.nashss.se.musicplaylistservice.dynamodb.models.Playlist;
import com.nashss.se.musicplaylistservice.models.PlaylistModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.initMocks;

public class SearchPlyatlistsTests {
    @Mock
    private PlaylistDao playlistDao;

    private SearchPlaylistsActivity searchPlaylistsActivity;

    @BeforeEach
    public void setUp() {
        initMocks(this);
        searchPlaylistsActivity = new SearchPlaylistsActivity(playlistDao);
    }

    @Test
    public void handleRequest_whenPlaylistsMatchSearch_returnsPlaylistModelListInResult() {
        // GIVEN
        String criteria = "good";
        String[] criteriaArray = {criteria};

        List<Playlist> expected = List.of(
                newPlaylist("id1", "a good playlist", List.of("tag1", "tag2")),
                newPlaylist("id2", "another good playlist", List.of("tag1", "tag2")));

        when(playlistDao.searchPlaylists(criteriaArray)).thenReturn(expected);

        SearchPlaylistsRequest request = SearchPlaylistsRequest.builder()
                .withCriteria(criteria)
                .build();

        // WHEN
        SearchPlaylistsResult result = searchPlaylistsActivity.handleRequest(request);

        // THEN
        List<PlaylistModel> resultPlaylists = result.getPlaylists();
        assertEquals(expected.size(), resultPlaylists.size());

        for (int i=0; i<expected.size(); i++) {
            assertEquals(expected.get(i).getId(), resultPlaylists.get(i).getId());
            assertEquals(expected.get(i).getName(), resultPlaylists.get(i).getName());
        }
    }

    private static Playlist newPlaylist(String id, String name, List<String> tags) {
        Playlist playlist = new Playlist();

        playlist.setId(id);
        playlist.setName(name);
        playlist.setTags(Sets.newHashSet(tags));

        playlist.setCustomerId("a customer id");
        playlist.setSongCount(0);

        return playlist;
    }

}
