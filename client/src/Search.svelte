<script>
    import { playSong, example, search } from "./api"
    import Search from "./search.svelte"

    export let onClick
    let searchResults = []

    let searchQuery = ""
    let timer;

    const debounce = (v) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            searchQuery = v;
            console.log("test");
        }, 750);
    };

    const performSearch = async (query) => {
        const results = await search(query);
        console.log(results);
        searchResults = results;
    };

    const selectSong = (id) => {
        playSong(id)
        onClick()
    }

    $: performSearch(searchQuery);
</script>

<div>
    <input
        type="text"
        placeholder="Search"
        on:keyup={({ target: { value } }) => debounce(value)}
    />

    <ul>
        {#each searchResults as result}
            <li on:click={selectSong(result.uri)}>
                <img
                    width="300"
                    height="300"
                    src={result.album.images[0].url}
                    alt={result.album.name}
                />
                {result.name}

                {#each result.artists as artist}
                    {artist.name}
                {/each}
            </li>
        {/each}
    </ul>
</div>
