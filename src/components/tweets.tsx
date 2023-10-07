import { formatDistanceToNow } from "date-fns";
import { db } from "../db";

export function TweetCard({
    author: { handle },
    createdAt,
    content,
    id,
}: {
    createdAt: Date;
    content: string;
    author: {
        handle: string;
    };
    id: string;
}) {
    return (
        <div class="chat chat-start">
            <div class="chat-header flex items-center gap-2">
                <span safe>@{handle}</span>
                <time class="text-xs opacity-50">
                    {formatDistanceToNow(createdAt, {
                        addSuffix: true,
                    })}
                </time>
            </div>
            <div class="chat-bubble relative">
                {content}
                <button
                    class="absolute -right-6 text-red-500"
                    hx-delete={`/api/tweets/${id}`}
                    hx-swap="outerHTML"
                    hx-target-4xx="next #tweetDeleteError"
                    hx-confirm="Are you sure you want to delete this tweet?"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-6 w-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                    </svg>
                </button>
            </div>
            <div id="tweetDeleteError" />
        </div>
    );
}

export async function InitialTweetList() {
    const tweetData = await db.tweet.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            author: {
                select: {
                    handle: true,
                },
            },
        },
    });

    const lastTweetTime = tweetData.at(-1)?.createdAt;

    return (
        <>
            <div class="space-y-4" id="tweetList">
                {tweetData.length > 0 ? (
                    tweetData.map((tweet) => (
                        <>
                            <TweetCard {...tweet} />
                            <div
                                hx-get={`/api/tweets?after=${lastTweetTime?.toISOString()}`}
                                hx-swap="beforeend"
                                hx-target="#tweetList"
                                hx-trigger="revealed"
                            />
                        </>
                    ))
                ) : (
                    <div>No tweets found</div>
                )}
            </div>
        </>
    );
}

export async function AdditionalTweetList({ after }: { after: Date }) {
    const tweetData = await db.tweet.findMany({
        where: {
            createdAt: {
                lt: after,
            },
        },
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            author: {
                select: {
                    handle: true,
                },
            },
        },
    });

    const lastTweetTime = tweetData[tweetData.length - 1]?.createdAt;

    return (
        <>
            {tweetData.map((tweet) => (
                <TweetCard {...tweet} />
            ))}
            {lastTweetTime && (
                <div
                    hx-get={`/api/tweets?after=${lastTweetTime.toISOString()}`}
                    hx-swap="beforeend"
                    hx-target="#tweetList"
                    hx-trigger="revealed"
                />
            )}
        </>
    );
}

export function TweetCreationForm() {
    return (
        <div class="rounded-lg border p-4 shadow-md">
            <h2 class="mb-4 text-xl font-bold">Create a new Tweet</h2>
            <form
                hx-post="/api/tweets"
                hx-swap="afterbegin"
                hx-target="#tweetList"
                _="on submit target.reset()"
            >
                <label class="mb-2 block text-sm font-bold" for="content">
                    Tweet:
                </label>
                <input
                    class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                    name="content"
                    required="true"
                />
                <button
                    class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                    type="submit"
                >
                    Post Tweet
                </button>
            </form>
        </div>
    );
}
