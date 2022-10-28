package com.nashss.se.musicplaylistservice.lambda;

import com.nashss.se.musicplaylistservice.activity.requests.AddSongToPlaylistRequest;
import com.nashss.se.musicplaylistservice.activity.results.AddSongToPlaylistResult;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class AddSongToPlaylistLambda
        extends LambdaActivityRunner<AddSongToPlaylistRequest, AddSongToPlaylistResult>
        implements RequestHandler<LambdaRequest<AddSongToPlaylistRequest>, LambdaResponse> {
    @Override
    public LambdaResponse handleRequest(LambdaRequest<AddSongToPlaylistRequest> input, Context context) {
        return super.runActivity(
            () -> input.fromBody(AddSongToPlaylistRequest.class),
            (request, serviceComponent) ->
                    serviceComponent.provideAddSongToPlaylistActivity().handleRequest(request)
        );
    }
}

