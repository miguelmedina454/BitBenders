$(document).ready(function() {
  $('#createBracketForm').on('submit', function(e) {
      e.preventDefault();  // Prevent the form from being submitted in the traditional way
      // Create an array of player names
      var names = $('#Names').val().split(',');
      if (names.length < 2) {
          alert('You must enter at least 2 names.');
          return;
      }

      var formData = {
          Names: $('#Names').val(),
          Format: $('#Format').val(),
          RandomSeeding: $('#RandomSeeding').is(':checked')
      };

      // Process the form data...

      // Create a format variable
      var format = formData.Format;

      // Create a RandomSeeding variable
      var randomSeeding = formData.RandomSeeding;

      // If RandomSeeding is true, shuffle the player names
      if (randomSeeding) {
          names.sort(function() {
              return 0.5 - Math.random();
          });
      }

      function roundToPowerOfTwo(names) {
          const numPlayers = names.length;
          const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
          const nullsToAdd = powerOfTwo - numPlayers;

          // Add nulls to the player list
          const paddedPlayers = names.concat(Array(nullsToAdd).fill(null));

          // Generate the order of the teams
          const order = seeding(powerOfTwo);

          // Initialize teams array
          const teams = [];

          // Split the players into teams (round 1 matches) based on the order
          for (let i = 0; i < powerOfTwo / 2; i++) {
              const team = [paddedPlayers[order[i * 2] - 1], paddedPlayers[order[i * 2 + 1] - 1]];
              teams.push(team);
          }

          return teams;
      }

      function seeding(numPlayers){
          var rounds = Math.log(numPlayers)/Math.log(2)-1;
          var pls = [1,2];
          for(var i=0;i<rounds;i++){
              pls = nextLayer(pls);
          }
          return pls;
          function nextLayer(pls){
              var out=[];
              var length = pls.length*2+1;
              pls.forEach(function(d){
                  out.push(d);
                  out.push(length-d);
              });
              return out;
          }
      }

      var teams = roundToPowerOfTwo(names);
      console.log(teams);

      if (teams.length > 0) {
          var singleElimination = {
              "teams": teams
              //results: [[]]  // Winners bracket
          };
          var doubleElimination = {
              teams: teams,
              results: [[[[]]], [], []] // Winners bracket, Losers bracket
          };

          // Create a bracketFormat variable based on the format
          var bracketFormat;
          if (format === 'Single Elimination') {
              bracketFormat = singleElimination;
          } else if (format === 'Double Elimination') {
              bracketFormat = doubleElimination;
          }

          $(function() {
              $('#minimal .demo').bracket({
                  init: bracketFormat
              });
          });
      } 
      else {
          console.error("No teams available to initialize the bracket.");
      }
  })
});