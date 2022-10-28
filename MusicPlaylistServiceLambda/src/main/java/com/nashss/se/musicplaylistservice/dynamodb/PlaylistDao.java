package com.nashss.se.musicplaylistservice.dynamodb;

import com.nashss.se.musicplaylistservice.dynamodb.models.Playlist;
import com.nashss.se.musicplaylistservice.exceptions.PlaylistNotFoundException;
import com.nashss.se.musicplaylistservice.metrics.MetricsConstants;
import com.nashss.se.musicplaylistservice.metrics.MetricsPublisher;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

import javax.inject.Inject;
import javax.inject.Singleton;

/**
 * Accesses data for a playlist using {@link Playlist} to represent the model in DynamoDB.
 */
@Singleton
public class PlaylistDao {
    private final DynamoDBMapper dynamoDbMapper;
    private final MetricsPublisher metricsPublisher;

    /**
     * Instantiates a PlaylistDao object.
     *
     * @param dynamoDbMapper the {@link DynamoDBMapper} used to interact with the playlists table
     * @param metricsPublisher the {@link MetricsPublisher} used to record metrics.
     */
    @Inject
    public PlaylistDao(DynamoDBMapper dynamoDbMapper, MetricsPublisher metricsPublisher) {
        this.dynamoDbMapper = dynamoDbMapper;
        this.metricsPublisher = metricsPublisher;
    }

    /**
     * Returns the {@link Playlist} corresponding to the specified id.
     *
     * @param id the Playlist ID
     * @return the stored Playlist, or null if none was found.
     */
    public Playlist getPlaylist(String id) {
        Playlist playlist = this.dynamoDbMapper.load(Playlist.class, id);

        if (playlist == null) {
            metricsPublisher.addCount(MetricsConstants.GETPLAYLIST_PLAYLISTNOTFOUND_COUNT, 1);
            throw new PlaylistNotFoundException("Could not find playlist with id " + id);
        }
        metricsPublisher.addCount(MetricsConstants.GETPLAYLIST_PLAYLISTNOTFOUND_COUNT, 0);
        return playlist;
    }

    /**
     * Saves (creates or updates) the given playlist.
     * @param playlist The playlist to save
     * @return The Playlist object that was saved
     */
    public Playlist savePlaylist(Playlist playlist) {
        this.dynamoDbMapper.save(playlist);
        return playlist;
    }
}
