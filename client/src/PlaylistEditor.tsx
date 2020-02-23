
import React, { useEffect, CSSProperties } from 'react'
// import { ScrollArea } from './ScrollArea'
import { useParams } from 'react-router-dom'
import { useResource, apiWrapper } from './apiWrapper'
import { classes, colors } from './styles'
import { SongRow } from './SongRow'
import { TableHeader } from './TableHeader'
import { PlaylistInfo } from './PlaylistInfo'


const usePlaylistData = (id: string) => {
  const [
    playlistResource, playlistSetter
  ] = useResource<SpotifyApi.PlaylistObjectFull>(null, true)
  const [
    addedByUsersResource, addedByUsersSetter
  ] = useResource<Record<string, SpotifyApi.UserObjectPublic>>(null, true)
  
  useEffect(() => {
    apiWrapper(`/api/playlists/${id}/`, playlistSetter)
  }, [id, playlistSetter])
  
  
  useEffect(() => {
    // once playlistResource has loaded:
    if (!playlistResource.loading && !playlistResource.error) {
      // get the list of addedBy user ids
      const ids = playlistResource.data.tracks.items.map(item => item.added_by.id)
      // filter out duplicates:
      const uniqueIds = ids.reduce(
        (aggregate: string[], id) =>
          aggregate.includes(id)
          ? aggregate
          : [...aggregate, id]
        , []
      )
      apiWrapper(`/api/users/?ids=${uniqueIds.join(',')}`, addedByUsersSetter)
    }
  }, [playlistResource, addedByUsersSetter])
  
  return [playlistResource, addedByUsersResource] as const
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
  
  // console.log({data, loading})
  
  
  const playlistEditorStyle: CSSProperties = {
    ...style,
    ...classes.column,
    // padding: '2.0rem',
    backgroundColor: colors.grayscale.darkGray,
  }
  const songsStyle = {
    padding: '0 2.0rem 2.0rem',
  }
  
  return <div style={playlistEditorStyle}>
    { playlistLoading
    ? null
    : <>
        <PlaylistInfo playlist={playlist} />
        <TableHeader />
        <div style={songsStyle}>
          { addedByUsersLoading
          ? null
          : playlist.tracks.items.map((item, index) => 
              <SongRow item={item} addedByUsers={addedByUsers} key={index}/>
            )
          }
        </div>
      </>
    }
  </div>
}








