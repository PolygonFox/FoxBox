<script>
    import { example } from "./api";
    import Search from "./search.svelte";

    let poller;
    let playList = [];

    const setupPoller = () => {
        if (poller) {
            clearInterval(poller);
        }

        poller = setInterval(doPoll, 2000);

        doPoll();
    };

    const doPoll = async () => {
        const data = await example();
        playList = data.playList;
    };

    // const addExample = async () => {
    //     console.log('add')

    //     await add()

    //     doPoll()
    // }

    $: setupPoller();

    let showSearch = false;
</script>

<div>
    <!-- <p>Wat is jouw naam?</p>
    <label>
        <input type="text" placeholder="Name" />
    </label>
    <button type="submit">Ga verder</button> -->

    {playList.length}

    <button on:click={() => (showSearch = true)}>Speel nummer af</button>
    {#if showSearch}
        <Search onClick={() => (showSearch = false)} />
    {/if}
</div>
