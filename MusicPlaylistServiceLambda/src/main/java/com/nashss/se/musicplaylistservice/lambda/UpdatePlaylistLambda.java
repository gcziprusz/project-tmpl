package com.nashss.se.musicplaylistservice.lambda;

import com.nashss.se.musicplaylistservice.activity.requests.UpdatePlaylistRequest;
import com.nashss.se.musicplaylistservice.activity.results.UpdatePlaylistResult;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class UpdatePlaylistLambda
        extends LambdaActivityRunner<UpdatePlaylistRequest, UpdatePlaylistResult>
        implements RequestHandler<LambdaRequest<UpdatePlaylistRequest>, LambdaResponse> {
    @Override
    public LambdaResponse handleRequest(LambdaRequest<UpdatePlaylistRequest> input, Context context) {
        return super.runActivity(
            () -> input.fromBody(UpdatePlaylistRequest.class),
            (request, serviceComponent) ->
                    serviceComponent.provideUpdatePlaylistActivity().handleRequest(request)
        );
    }
}

