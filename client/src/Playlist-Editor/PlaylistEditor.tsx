
import React, { useEffect, CSSProperties, useReducer, useCallback } from 'react'
// import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'
import { useResource, fetchWrapper } from '../fetchWrapper'
import { classes, colors } from '../styles'
// import { SavedSongRow, DraftAdditionSongRow } from './SongRow'
import { SavedSongRow } from './SavedSongRow'
import { DraftAdditionSongRow } from './DraftAdditionSongRow'
// import { TableHeader } from './TableHeader'
import { PlaylistTableHeader } from './PlaylistTableHeader'
import { PlaylistInfo } from './PlaylistInfo'
import { SearchPanel } from './SearchPanel'
import { initialState, modificationReducer } from './modificationReducer'
import { playlistContext } from './playlistContext'
import { SeparateChat } from './Chat/SeparateChat'
import { GetPlaylistIdResponse } from '../shared/apiTypes'


const usePlaylistData = (playlistId: string) => {
  const [
    playlistResource, playlistSetter
  ] = useResource<GetPlaylistIdResponse>(null, true)
  const [
    addedByUsersResource, addedByUsersSetter
  ] = useResource<Record<string, SpotifyApi.UserObjectPublic>>(null, true)
  
  
  const loadPlaylist = useCallback(async () => {
    const response = await fetchWrapper<GetPlaylistIdResponse>(`/api/playlists/${playlistId}/`)
    playlistSetter({
      loading: false,
      ...response,
    })
  }, [playlistId, playlistSetter])
  
  useEffect(() => {
    loadPlaylist()
  }, [loadPlaylist])
  
  
  useEffect(() => {
    if (playlistResource.loading || playlistResource.error) { return }
    // once playlistResource has loaded:
    // get the list of addedBy user ids
    const userIds = playlistResource.data.tracks.map(track => track.addedBy)
    // safeguard against empty list
    if (userIds.length === 0) {
      addedByUsersSetter({
        data: null,
        loading: false,
      })
      return
    }
    // filter out duplicates:
    const uniqueIds = userIds.reduce(
      (aggregate: string[], userId) =>
        aggregate.includes(userId)
        ? aggregate
        : [...aggregate, userId]
      , []
    )
    ;(async () => {
      const response = await fetchWrapper(`/api/users/?ids=${uniqueIds.join(',')}`)
      addedByUsersSetter({
        loading: false,
        ...response,
      })
    })()
  }, [playlistResource, addedByUsersSetter])
  
  return [playlistResource, addedByUsersResource, loadPlaylist] as const
}





const searchTabStyle = {
  flex: 0.2,
}
const playlistEditorStyle = {
  ...classes.row,
  flex: 0.8,
}
const playlistTableStyle = {
  ...classes.column,
  flex: 3,
  // padding: '2.0rem',
  backgroundColor: colors.grayscale.darkGray,
  overflow: 'auto',
}
const tHeadStyle = {
  background: colors.grayscale.gray,
  padding: '2.0rem 2.0rem 0',
  position: 'sticky',
  top: 0,
} as const
const songsStyle = {
  padding: '0 2.0rem 2.0rem',
}
const separateChatStyle = {
  flex: 1,
}


export const PlaylistEditor = ({
  style,
}: {
  style?: CSSProperties,
}) => {
  const { id } = useParams()
  
  const [
    { data: playlist, loading: playlistLoading },
    { data: addedByUsers, loading: addedByUsersLoading },
    loadPlaylist,
  ] = usePlaylistData(id)
  
  console.log(playlist, playlistLoading, addedByUsers, addedByUsersLoading)
  
  // console.log({data, loading})
  
  const [modificationState, dispatch] = useReducer(modificationReducer, initialState)
  
  
  const panelStyle = {
    ...classes.row,
    ...style,
  }
  
  return <playlistContext.Provider value={{
    modificationState, dispatch, loadPlaylist
  }}>
    <div style={panelStyle}>
      <SearchPanel style={searchTabStyle}/>
      <div style={playlistEditorStyle}>
        <div style={playlistTableStyle}>
          { playlistLoading
          ? null
          : <>
              <div style={tHeadStyle}>
                <PlaylistInfo playlist={playlist} />
                <PlaylistTableHeader />
              </div>
              <div style={songsStyle}>
                { addedByUsersLoading
                ? null
                : playlist.tracks.map((track, index) => 
                    <SavedSongRow track={track} addedByUsers={addedByUsers} key={index}/>
                  )
                }
                { modificationState.userAction === 'add' &&
                  <DraftAdditionSongRow trackData={modificationState.trackData} />
                }
              </div>
            </>
          }
        </div>
        { false && <SeparateChat
          chat={[]}
          reloadPlaylist={() => void(0)}
          style={separateChatStyle}
        /> }
      </div>
    </div>
  </playlistContext.Provider>
}








