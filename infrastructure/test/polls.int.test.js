const dotenv = require("dotenv");
dotenv.config({ path: "C:\\dev\\mezinamiridici\\infrastructure\\.test.env" });
const mongo = require("../src/utils/mongo.js");
const logger = require("../src/utils/logging");
const app = require("../src/server.js");
const { api, bff, getAuthHeader, deepCopy, sleep } = require("./testUtils");
const { leos, jiri, lukas, vita, jana, bara } = require("./prepareUsers");
let jwtVita, jwtLeos, jwtJiri, jwtLukas, jwtJana, jwtBara;
let dbClient;

test("Poll API", async (done) => {
    jest.setTimeout(60000);

    // create poll, anonymous user
    let body = {
        text: "First question",
    };
    let response = await api("polls", { method: "POST", json: body });
    expect(response.statusCode).toBe(401);

    // create poll, insufficient privilleges
    body = {
        text: "First question",
    };
    response = await api("polls", {method: "POST", json: body, headers: getAuthHeader(jwtVita) });
    expect(response.statusCode).toBe(403);

    // create poll, admin privilleges
    const firstPoll = {
        text: "First question",
    };
    response = await api("polls", { method: "POST", json: firstPoll, headers: getAuthHeader(jwtLeos) }).json();
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
    expect(response.data._id).toBeDefined();
    firstPoll.id = response.data._id;
    firstPoll.slug = response.data.info.slug;

    // create second poll
    const secondPoll = {
        text: "Second question",
    };
    await sleep(100);
    response = await api("polls", { method: "POST", json: secondPoll, headers: getAuthHeader(jwtLeos) }).json();
    expect(response.success).toBeTruthy();
    secondPoll.id = response.data._id;
    secondPoll.slug = response.data.info.slug;

    // create third poll
    const thirdPoll = {
        text: "Third question",
    };
    await sleep(100);
    response = await api("polls", { method: "POST", json: thirdPoll, headers: getAuthHeader(jwtLeos) }).json();
    expect(response.success).toBeTruthy();
    thirdPoll.id = response.data._id;
    thirdPoll.slug = response.data.info.slug;

    // create fourth poll
    const fourthPoll = {
        text: "Fourth question",
    };
    await sleep(100);
    response = await api("polls", { method: "POST", json: fourthPoll, headers: getAuthHeader(jwtLeos) }).json();
    expect(response.success).toBeTruthy();
    fourthPoll.id = response.data._id;
    fourthPoll.slug = response.data.info.slug;

    // vote
    body = { vote: "neutral" };
    response = await bff(`polls/${firstPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtLeos) }).json();
    expect(response.success).toBeTruthy();
    expect(response.data).toBeDefined();
    expect(response.data._id).toBe(firstPoll.id);
    expect(response.data.info.caption).toBe(firstPoll.text);
    expect(response.data.info.slug).toBe("first-question");
    expect(response.data.info.published).toBe(true);
    expect(response.data.my_vote).toBe("neutral");
    expect(response.data.votes_count).toBe(1);
    expect(response.data.votes.neutral).toBe(1);
    expect(response.data.votes.trivial).toBe(0);
    expect(response.data.votes.dislike).toBe(0);
    expect(response.data.votes.hate).toBe(0);

    // get poll, anonymous user
    let getResponse = await bff(`polls/${response.data.info.slug}`).json();
    let copy = deepCopy(response);
    delete copy.data.my_vote;
    expect(getResponse).toStrictEqual(copy);

    // get poll, other user that has not voted
    getResponse = await bff(`polls/${response.data.info.slug}`, { headers: getAuthHeader(jwtJiri) }).json();
    expect(getResponse).toStrictEqual(copy);

    // get poll, user that has voted
    getResponse = await bff(`polls/${response.data.info.slug}`, { headers: getAuthHeader(jwtLeos) }).json();
    expect(getResponse).toStrictEqual(response);

    // get non-existent poll
    response = await bff("polls/abc", { responseType: 'json' });
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBeFalsy();

    // Leos' votes
    body = { vote: "neutral" };
    response = await bff(`polls/${secondPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtLeos) }).json();
    expect(response.success).toBeTruthy();
    response = await bff(`polls/${thirdPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtLeos) }).json();
    expect(response.success).toBeTruthy();
    response = await bff(`polls/${fourthPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtLeos) }).json();
    expect(response.success).toBeTruthy();
    // Jiri's votes
    body.vote = "trivial";
    response = await bff(`polls/${firstPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtJiri) }).json();
    expect(response.success).toBeTruthy();
    response = await bff(`polls/${secondPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtJiri) }).json();
    expect(response.success).toBeTruthy();
    response = await bff(`polls/${thirdPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtJiri) }).json();
    expect(response.success).toBeTruthy();
    response = await bff(`polls/${fourthPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtJiri) }).json();
    expect(response.success).toBeTruthy();
    // Lukas's votes
    body.vote = "neutral";
    response = await bff(`polls/${firstPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtLukas) }).json();
    expect(response.success).toBeTruthy();
    body.vote = "trivial";
    response = await bff(`polls/${secondPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtLukas) }).json();
    expect(response.success).toBeTruthy();
    body.vote = "dislike";
    response = await bff(`polls/${thirdPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtLukas) }).json();
    expect(response.success).toBeTruthy();
    body.vote = "hate";
    response = await bff(`polls/${fourthPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtLukas) }).json();
    expect(response.success).toBeTruthy();
    // Vita's votes
    body.vote = "dislike";
    response = await bff(`polls/${firstPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtVita) }).json();
    expect(response.success).toBeTruthy();
    response = await bff(`polls/${secondPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtVita) }).json();
    expect(response.success).toBeTruthy();
    response = await bff(`polls/${thirdPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtVita) }).json();
    expect(response.success).toBeTruthy();
    body.vote = "hate";
    response = await bff(`polls/${fourthPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtVita) }).json();
    expect(response.success).toBeTruthy();
    // Jana's votes
    response = await bff(`polls/${firstPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtJana) }).json();
    expect(response.success).toBeTruthy();
    response = await bff(`polls/${secondPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtJana) }).json();
    expect(response.success).toBeTruthy();
    body.vote = "trivial";
    response = await bff(`polls/${thirdPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtJana) }).json();
    expect(response.success).toBeTruthy();
    body.vote = "hate";
    response = await bff(`polls/${fourthPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtJana) }).json();
    expect(response.success).toBeTruthy();
    // Bara's votes
    response = await bff(`polls/${firstPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtBara) }).json();
    expect(response.success).toBeTruthy();
    response = await bff(`polls/${fourthPoll.id}/votes`, { method: "POST", json: body, headers: getAuthHeader(jwtBara) }).json();
    expect(response.success).toBeTruthy();

    // Invalid votes
    response = await bff(`polls/${firstPoll.id}/votes`, { method: "POST", json: {}, responseType: 'json', headers: getAuthHeader(jwtJana) });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);

    // check first poll as Leos
    response = await bff(`polls/${firstPoll.slug}`, { headers: getAuthHeader(jwtLeos) }).json();
    expect(response.data._id).toBe(firstPoll.id);
    expect(response.data.my_vote).toBe("neutral");
    expect(response.data.votes_count).toBe(6);
    expect(response.data.votes.neutral).toBe(2);
    expect(response.data.votes.trivial).toBe(1);
    expect(response.data.votes.dislike).toBe(1);
    expect(response.data.votes.hate).toBe(2);

    // check second poll as Jiri
    response = await bff(`polls/${secondPoll.slug}`, { headers: getAuthHeader(jwtJiri) }).json();
    expect(response.data._id).toBe(secondPoll.id);
    expect(response.data.my_vote).toBe("trivial");
    expect(response.data.votes_count).toBe(5);
    expect(response.data.votes.neutral).toBe(1);
    expect(response.data.votes.trivial).toBe(2);
    expect(response.data.votes.dislike).toBe(1);
    expect(response.data.votes.hate).toBe(1);

    // check third as Bara
    response = await bff(`polls/${thirdPoll.slug}`, { headers: getAuthHeader(jwtBara) }).json();
    expect(response.data._id).toBe(thirdPoll.id);
    expect(response.data.my_vote).toBeUndefined();
    expect(response.data.votes_count).toBe(5);
    expect(response.data.votes.neutral).toBe(1);
    expect(response.data.votes.trivial).toBe(2);
    expect(response.data.votes.dislike).toBe(2);
    expect(response.data.votes.hate).toBe(0);

    // check the last poll as anonymous user
    response = await bff("polls/last").json();
    expect(response.data._id).toBe(fourthPoll.id);
    expect(response.data.my_vote).toBeUndefined();
    expect(response.data.votes_count).toBe(6);
    expect(response.data.votes.neutral).toBe(1);
    expect(response.data.votes.trivial).toBe(1);
    expect(response.data.votes.dislike).toBe(0);
    expect(response.data.votes.hate).toBe(4);

    // check the last poll as Vita
    response = await bff("polls/last", { headers: getAuthHeader(jwtVita) }).json();
    expect(response.data._id).toBe(fourthPoll.id);
    expect(response.data.my_vote).toBe("hate");

    // get all polls with default params
    response = await api("polls/").json();
    expect(response.data.length).toBe(4);
    expect(response.data[0]._id).toBe(fourthPoll.id);
    expect(response.data[1]._id).toBe(thirdPoll.id);
    expect(response.data[2]._id).toBe(secondPoll.id);
    expect(response.data[3]._id).toBe(firstPoll.id);

    // get last two polls
    response = await api("polls?obd=date&ps=2").json();
    expect(response.data.length).toBe(2);
    expect(response.data[0]._id).toBe(fourthPoll.id);
    expect(response.data[1]._id).toBe(thirdPoll.id);

    // get second and third poll
    response = await api(`polls?oba=date&ps=2&lr=id:${firstPoll.id}`).json();
    expect(response.data.length).toBe(2);
    expect(response.data[0]._id).toBe(secondPoll.id);
    expect(response.data[1]._id).toBe(thirdPoll.id);

    // get fourth poll
    response = await api(`polls?obd=date&lr=id:${secondPoll.id}`).json();
    expect(response.data.length).toBe(1);
    expect(response.data[0]._id).toBe(firstPoll.id);

    // get first poll votes
    response = await bff(`polls/${firstPoll.id}/votes`).json();
    expect(response.success).toBeTruthy();
    expect(response.data).toContainEqual({ _id: 'neutral', count: 2 });
    expect(response.data).toContainEqual({ _id: 'trivial', count: 1 });
    expect(response.data).toContainEqual({ _id: 'dislike', count: 1 });
    expect(response.data).toContainEqual({ _id: 'hate', count: 2 });

    // get first poll votes, filter by car
    response = await bff(`polls/${firstPoll.id}/votes?vehicles=car`).json();
    expect(response.success).toBeTruthy();
    expect(response.data).toContainEqual({ _id: 'neutral', count: 1 });
    expect(response.data).toContainEqual({ _id: 'trivial', count: 1 });
    expect(response.data).toContainEqual({ _id: 'dislike', count: 1 });
    expect(response.data).toContainEqual({ _id: 'hate', count: 1 });

    // get first poll votes, filter by bike or truck
    response = await bff(`polls/${firstPoll.id}/votes?vehicles=bike&vehicles=truck`).json();
    expect(response.success).toBeTruthy();
    expect(response.data.some(({_id}) => _id === "neutral")).toBe(false);
    expect(response.data).toContainEqual({ _id: 'trivial', count: 1 });
    expect(response.data).toContainEqual({ _id: 'dislike', count: 1 });
    expect(response.data).toContainEqual({ _id: 'hate', count: 1 });

    // get first poll votes, filter by woman
    response = await bff(`polls/${firstPoll.id}/votes?sex=woman`).json();
    expect(response.success).toBeTruthy();
    expect(response.data.some(({_id}) => _id === "neutral")).toBe(false);
    expect(response.data.some(({_id}) => _id === "trivial")).toBe(false);
    expect(response.data.some(({_id}) => _id === "dislike")).toBe(false);
    expect(response.data).toContainEqual({ _id: 'hate', count: 2 });

    // get first poll votes, filter by man or woman
    response = await bff(`polls/${firstPoll.id}/votes?sex=man&sex=woman`).json();
    expect(response.success).toBeTruthy();
    expect(response.data).toContainEqual({ _id: 'neutral', count: 1 });
    expect(response.data).toContainEqual({ _id: 'trivial', count: 1 });
    expect(response.data).toContainEqual({ _id: 'dislike', count: 1 });
    expect(response.data).toContainEqual({ _id: 'hate', count: 2 });

    // get first poll votes, filter by primary or secondary education
    response = await bff(`polls/${firstPoll.id}/votes?edu=primary&edu=secondary`).json();
    expect(response.success).toBeTruthy();
    expect(response.data.some(({_id}) => _id === "neutral")).toBe(false);
    expect(response.data).toContainEqual({ _id: 'trivial', count: 1 });
    expect(response.data.some(({_id}) => _id === "dislike")).toBe(false);
    expect(response.data).toContainEqual({ _id: 'hate', count: 1 });

    // get first poll votes, filter by primary, secondary or university education
    response = await bff(`polls/${firstPoll.id}/votes?edu=primary&edu=secondary&edu=university`).json();
    expect(response.success).toBeTruthy();
    expect(response.data).toContainEqual({ _id: 'neutral', count: 1 });
    expect(response.data).toContainEqual({ _id: 'trivial', count: 1 });
    expect(response.data).toContainEqual({ _id: 'dislike', count: 1 });
    expect(response.data).toContainEqual({ _id: 'hate', count: 2 });

    // get first poll votes, filter by PRG region
    response = await bff(`polls/${firstPoll.id}/votes?region=PRG`).json();
    expect(response.success).toBeTruthy();
    expect(response.data).toContainEqual({ _id: 'neutral', count: 1 });
    expect(response.data.some(({_id}) => _id === "trivial")).toBe(false);
    expect(response.data.some(({_id}) => _id === "dislike")).toBe(false);
    expect(response.data).toContainEqual({ _id: 'hate', count: 1 });

    // get first poll votes, filter by age under 30
    response = await bff(`polls/${firstPoll.id}/votes?age=0:30`).json();
    expect(response.success).toBeTruthy();
    expect(response.data.some(({_id}) => _id === "neutral")).toBe(false);
    expect(response.data.some(({_id}) => _id === "trivial")).toBe(false);
    expect(response.data.some(({_id}) => _id === "dislike")).toBe(false);
    expect(response.data).toContainEqual({ _id: 'hate', count: 2 });

    // get first poll votes, filter by age 40-42
    response = await bff(`polls/${firstPoll.id}/votes?age=40:43`).json();
    expect(response.success).toBeTruthy();
    expect(response.data.some(({_id}) => _id === "neutral")).toBe(false);
    expect(response.data).toContainEqual({ _id: 'trivial', count: 1 });
    expect(response.data).toContainEqual({ _id: 'dislike', count: 1 });
    expect(response.data.some(({_id}) => _id === "hate")).toBe(false);

    // get first poll votes, filter by driving 10-20 years
    response = await bff(`polls/${firstPoll.id}/votes?driving=10:21`).json();
    expect(response.success).toBeTruthy();
    expect(response.data).toContainEqual({ _id: 'neutral', count: 1 });
    expect(response.data.some(({_id}) => _id === "trivial")).toBe(false);
    expect(response.data).toContainEqual({ _id: 'dislike', count: 1 });
    expect(response.data.some(({_id}) => _id === "hate")).toBe(false);

    done();
});

beforeEach(async () => {
    await dbClient.db().collection("items").deleteMany({});
    await dbClient.db().collection("polls").deleteMany({});
    await dbClient.db().collection("poll_votes").deleteMany({});
});

beforeAll(async () => {
    app.listen(3000, '0.0.0.0')
        .then(r => logger.info("Server started"));

    dbClient = await mongo.connectToDatabase();
    await dbClient.db().collection("users").deleteMany({});
    await dbClient.db().collection("users").insertMany([leos, jiri, lukas, vita, jana, bara]);

    let body = {
        email: "vita@email.bud",
        password: "BadPassword",
    };
    let response = await api("authorizeUser", { method: 'POST', json: body }).json();
    jwtVita = response.data;

    body.email = "leos@email.bud";
    response = await api("authorizeUser", { method: 'POST', json: body }).json();
    jwtLeos = response.data;

    body.email = "jiri@email.bud";
    response = await api("authorizeUser", { method: 'POST', json: body }).json();
    jwtJiri = response.data;

    body.email = "lukas@email.bud";
    response = await api("authorizeUser", { method: 'POST', json: body }).json();
    jwtLukas = response.data;

    body.email = "jana@email.bud";
    response = await api("authorizeUser", { method: 'POST', json: body }).json();
    jwtJana = response.data;

    body.email = "bara@email.bud";
    response = await api("authorizeUser", { method: 'POST', json: body }).json();
    jwtBara = response.data;
});

afterAll(() => {
    mongo.close();
    if (app.close())
        logger.info("Server stopped");
});
