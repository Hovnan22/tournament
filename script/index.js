
app = {
    url:'./data/response.json',
    teams: {},
    firstGroup: {},
    secondGroup : {},
    teamsIndex: {},
    started: false,

    init:  async function() {
        app.groupsCount = await app.getData();
        app.groupsCount = app.groupsCount/2;
        app.bindEvents();
    },

    getData : async function () {
        var data = {};
       await $.getJSON(app.url, function(response) {
            if(response.status === "success"){
                data =  response.data;
                response.data.map(function(team,index) {
                    app.teams[team.team_id] = {
                        ...team,
                        inGame: true,
                    }
                  });

            }else {
                return "error"
            }
        });
        return data.length;
    },

    bindEvents: function() {
        $('.start').on('click', function() {
            if(!app.started){
                app.createGroups();
            } else {
                console.log(Object.keys(app.firstGroup))
                if(Object.keys(app.firstGroup).length == 1){
                    $('.start').off('click');
                    var winner_id = app.getRandomTeam([Object.keys(app.firstGroup)[0],Object.keys(app.secondGroup)[0]]);
                    $('.start').html('');
                    if(app.firstGroup[winner_id]){
                        $('.winner').html(`<div>${app.firstGroup[winner_id].team_name}</div>`);
                    }else {
                        $('.winner').html(`<div>Win ${app.secondGroup[winner_id].team_name}</div>`);
                    }
                    return false;
                }

                console.log(app.firstGroup);
                app.play(app.firstGroup);
                app.play(app.secondGroup);


                app.drawGroup(app.firstGroup, $('.groupOne'));
                app.drawGroup(app.secondGroup,$('.groupTwo'));
                app.checkGroups(app.firstGroup);
                app.checkGroups(app.secondGroup);


            }
        });

    },
    play: function(group,count = 0) {
        var groupArray = Object.keys(group)
        var length = count == 0 ? 2: 2 + count;
        var random = [];
        var k = 0;
        for (var i = count ; i < length ; i++) {
            random[k] = groupArray[i];
            k++;
        }
        group[app.getRandomTeam(random)].inGame = false;
        if(length <= groupArray.length - 2){
            app.play(group,length);
        }
    },
    checkGroups: function(group) {
        for( param in group) {
            if(!group[param].inGame){
                delete group[param]
            }
        }
    },

    createGroups: function() {
        var i = 0;
        if(!app.teams){
            return false;
        }
        app.started = true
        while(i < app.groupsCount) {
            var index = app.getIndex (0,app.groupsCount * 2 - 1);
            if(app.teams[index]){
                app.firstGroup[index] = {
                    ...app.teams[index],
                }
                delete app.teams[index];
                i++;
            }
        }
        app.secondGroup = {...app.teams};
        delete app.teams;
        app.drawGroups();

    },

    getIndex: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    drawGroups: function(group) {
        app.drawGroup(app.firstGroup, $('.groupOne'));
        app.drawGroup(app.secondGroup,$('.groupTwo'));
    },

    drawGroup: function(group,parentElement) {
        var groupItems = '<div class="items">';
        for (var prop in group) {
            if(!group[prop].inGame){
                continue
            }
            groupItems += `<div class="team">
            <!--<img src="./images/${ group[prop].team_name}.png">-->
            <div class="title" data-index="${group[prop].team_id}" data-pair="${group[prop].pair}">${ group[prop].team_name}</div> 
            </div>`;
        }
        groupItems += '</div>'
        parentElement.append(groupItems)

    },
    getRandomTeam: function(items) {
        return items[Math.floor(Math.random()*items.length)];

    },

}

$(document).ready(function() {
    app.init();
    
});