module Main exposing (..)

import Platform.Sub
import String
import Html exposing (Html, div, img, h2, h3, h4, h6, span, section,  text, p)
import Html.Attributes exposing (class, id, src)

import Content exposing (..)
import Shared exposing (..)
import HttpUtils exposing (registerMe)
import View
import Header
import Form


-- PROGRAM


main : Program Never Model Msg
main = Html.program
  { init = init
  , view = view
  , update = update
  , subscriptions = subscriptions
  }


init : ( Model, Cmd Msg )
init =
    ( Shared.initialModel, Cmd.none )


initialView = view Shared.initialModel


-- UPDATE


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ToggleNavigation show ->
      ({ model | showNavigation = show }, Cmd.none )
    FormMsg subMsg ->
      let
        ( updatedFormModel, widgetCmd ) =
          Form.update subMsg model.formModel
      in
        ( { model | formModel = updatedFormModel }, Cmd.map FormMsg widgetCmd )
    Register ->
      ( { model | signed = True }, registerMe model )
    PostResult (Ok result) ->
      ( { model | registered = True }, Cmd.none )
    PostResult (Err httpError) ->
      let
        error = Debug.log "Post failed" (toString httpError) 
      in
          ( { model | error = error }, Cmd.none )
    
        
view : Model -> Html Msg
view model =
  div [ id "container" ]
    [ View.header model.showNavigation Nothing (\c -> ToggleNavigation (not c))

    , View.banner

    , View.about model

    , View.eventDescription 

    , View.registrationForm model

    , View.contacts

    , View.map (View.Coordinates 16 35.8512874 14.4943021)

    , View.footer
    ]



subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none
