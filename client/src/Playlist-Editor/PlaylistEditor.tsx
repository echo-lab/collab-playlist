
import React, { useEffect, CSSProperties, useReducer } from 'react'
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
import { initialState, modificationReducer, modificationReducerContext } from './modificationReducer'
import { SeparateChat } from './SeparateChat'


const usePlaylistData = (playlistId: string) => {
  const [
    playlistResource, playlistSetter
  ] = useResource<SpotifyApi.PlaylistObjectFull>(null, true)
  const [
    addedByUsersResource, addedByUsersSetter
  ] = useResource<Record<string, SpotifyApi.UserObjectPublic>>(null, true)
  
  useEffect(() => {
    (async () => {
      // playlistSetter({ loading: true })
      const response = await fetchWrapper(`/api/playlists/${playlistId}/`)
      playlistSetter({
        loading: false,
        ...response,
      })
    })()
  }, [playlistId, playlistSetter])
  
  
  useEffect(() => {
    if (playlistResource.loading || playlistResource.error) { return }
    // once playlistResource has loaded:
    // get the list of addedBy user ids
    const userIds = playlistResource.data.tracks.items.map(item => item.added_by.id)
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
  
  return [playlistResource, addedByUsersResource] as const
}





const searchTabStyle = {
  flex: 0.2,
}
const playlistEditorStyle = {
  ...classes.column,
  flex: 0.6,
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
  flex: 0.2,
}


export const PlaylistEditor = ({
  style,
}: {
  style?: CSSProperties,
}) => {
  const { id } = useParams()
  
  const [
    { data: playlist, loading: playlistLoading },
    { data: addedByUsers, loading: addedByUsersLoading }
  ] = usePlaylistData(id)
  
  console.log(playlist, playlistLoading, addedByUsers, addedByUsersLoading)
  
  // console.log({data, loading})
  
  const [modificationState, dispatch] = useReducer(modificationReducer, initialState)
  
  
  const panelStyle = {
    ...classes.row,
    ...style,
  }
  
  return <modificationReducerContext.Provider value={{ modificationState, dispatch }}>
    <div style={panelStyle}>
      <SearchPanel style={searchTabStyle}/>
      <table style={playlistEditorStyle}>
        { playlistLoading
        ? null
        : <>
            <thead style={tHeadStyle}>
              <PlaylistInfo playlist={playlist} />
              <PlaylistTableHeader />
            </thead>
            <tbody style={songsStyle}>
              { addedByUsersLoading
              ? null
              : playlist.tracks.items.map((item, index) => 
                  <SavedSongRow item={item} addedByUsers={addedByUsers} key={index}/>
                )
              }
              { modificationState.userAction === 'add' &&
                <DraftAdditionSongRow item={modificationState.songObject} />
              }
            </tbody>
          </>
        }
      </table>
      <SeparateChat
        chat={[]}
        reloadPlaylist={() => void(0)}
        style={separateChatStyle}
      />
    </div>
  </modificationReducerContext.Provider>
}








