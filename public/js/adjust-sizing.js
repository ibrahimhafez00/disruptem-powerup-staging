var t = window.TrelloPowerUp.iframe();

var ENDPOINT_URL = "http://localhost:9000/api/v1";
// Wait for the DOM to be loaded
document.addEventListener("DOMContentLoaded", function () {
  var memberIdSelect = document.getElementById("member");
  var categorySelect = document.getElementById("category");
  var sizingInput = document.getElementById("sizing");
  // Populate form fields from initial data passed to the iframe
  var initialData = t.arg("initialFormData");
  console.log("initialFormDatainitialFormData", initialData);
  const body = { pointId: initialData.pointId, cardId: initialData.cardId };
  // Fetch point data and populate the selects
  fetch(`${ENDPOINT_URL}/public/trello/points`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("bodybody", data);
      const defaultMember = data.data?.memberId?._id;
      const defaultCategory = data.data?.categoryId?._id;
      sizingInput.value = data.data?.sizing;
      // Fetch additional members and populate the member select
      fetch(`${ENDPOINT_URL}/public/trello/members`)
        .then((response) => response.json())
        .then((data) => {
          console.log("membersss", data);
          fetch(`${ENDPOINT_URL}/cards/${initialData.cardId}`)
            .then((response) => response.json())
            .then((card) => {
              console.log("membersss", data);
              console.log("cardssss", card);
              data.data.members.forEach((member) => {
                if (
                  !card.data.members
                    .map((mem) => mem.memberId?._id)
                    .includes(member._id) ||
                  (card.data.members
                    .map((mem) => mem.memberId?._id)
                    .includes(member._id) &&
                    member._id === defaultMember)
                ) {
                  var option = document.createElement("option");
                  option.selected = member._id === defaultMember;
                  option.value = `${member._id}-${member.name}`;
                  option.textContent = member.name;
                  memberIdSelect.appendChild(option);
                }
              });
            });
        });

      // Fetch categories and populate the category select
      fetch(`${ENDPOINT_URL}/public/trello/categories`)
        .then((response) => response.json())
        .then((data) => {
          console.log("categoriessss", data);
          data.data.categories.forEach((category) => {
            var option = document.createElement("option");
            option.value = `${category._id}-${category.color}-${category.name}`;
            option.textContent = category.name;
            option.selected = category._id === defaultCategory;
            categorySelect.appendChild(option);
          });
        });
    });
  document.getElementById("deleteBtn").addEventListener("click", function () {
    // Fetch request to delete item
    fetch(`${ENDPOINT_URL}/cards/delete-point`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        FetchAndPaint(t);
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
      });
  });

  // Submit button logic
  document.getElementById("submit").addEventListener("click", function () {
    // Construct the data to be sent
    console.log(
      !parseFloat(sizingInput.value) ||
        (parseFloat(sizingInput.value) &&
          (!memberIdSelect.value || !categorySelect.value))
    );
    if (
      !parseFloat(sizingInput.value) ||
      (parseFloat(sizingInput.value) &&
        !memberIdSelect.value &&
        !categorySelect.value)
    ) {
      return;
    }
    console.log("REACH");
    var updatedData = {
      memberId: memberIdSelect.value.split("-")[0],
      categoryId: categorySelect?.value.split("-")[0],
      sizing: parseFloat(sizingInput.value),
      pointId: initialData.pointId,
      cardId: initialData.cardId,
    };
    fetch(`${ENDPOINT_URL}/cards/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => FetchAndPaint(t));
    console.log(updatedData);
    // t.get("card", "shared", "detailBadgeData").then(function (detailBadgeData) {
    //   // Object.freeze(detailBadgeData);
    //   console.log("SADASDASDASD", detailBadgeData);
    //   // filtering(deleting) all badges for this point
    //   detailBadgeData = detailBadgeData.filter(
    //     (badge) => {
    //       console.log("badge.pointId === initialData.pointId",badge.pointId, initialData.pointId)
    //       return badge.pointId === initialData.pointId
    //     }
    //   );
    //   //creating new badge for category
    //   if (updatedData.categoryId) {
    //     const existingCategoryBadge = detailBadgeData.find(
    //       (badge) =>
    //         updatedData.categoryId &&
    //         badge.categoryId &&
    //         badge.categoryId === updatedData.categoryId
    //     );
    //     if (!existingCategoryBadge) {
    //       const categoryBadge = {
    //         title: "",
    //         text: categorySelect.value.split("-")[2],
    //         sizing: parseFloat(sizingInput.value),
    //         color: categorySelect.value.split("-")[1],
    //         cardId: initialData.cardId,
    //         categoryId: categorySelect.value.split("-")[0],
    //         pointId: initialData.pointId,
    //         listId: initialData.listId,
    //         // callback: function (t) {
    //         //   // Fetch initial data
    //         //   //fetch
    //         //   const initialFormData = {
    //         //     cardId: initialData.cardId,
    //         //     pointId: initialData.pointId,
    //         //     listId: initialData.listId,
    //         //   };
    //         //   return t.popup({
    //         //     title: "Adjust Member Sizing",
    //         //     url: "./adjust-size.html",
    //         //     args: { initialFormData },
    //         //     height: 240,
    //         //   });
    //         // },
    //       };
    //       detailBadgeData.push(categoryBadge);
    //     }
    //   }
    //   if (updatedData.memberId) {
    //     const existingMemberBadge = detailBadgeData.find(
    //       (badge) =>
    //         updatedData.memberId &&
    //         badge.memberId &&
    //         badge.memberId === updatedData.memberId
    //     );
    //     if (!existingMemberBadge) {
    //       const memberBadge = {
    //         title: memberIdSelect.value.split("-")[1],
    //         text: parseFloat(sizingInput.value),
    //         sizing: parseFloat(sizingInput.value),
    //         color: "red",
    //         memberId: memberIdSelect.value.split("-")[0],
    //         cardId: initialData.cardId,
    //         pointId: initialData.pointId,
    //         listId: initialData.listId,
    //         callback: function (t) {
    //           // Fetch initial data
    //           //fetch
    //           const initialFormData = {
    //             cardId: initialData.cardId,
    //             pointId: initialData.pointId,
    //             listId: initialData.listId,
    //           };
    //           return t.popup({
    //             title: "Adjust Member Sizing",
    //             url: "./adjust-size.html",
    //             args: { initialFormData },
    //             height: 240,
    //           });
    //         },
    //       };
    //       detailBadgeData.push(memberBadge);
    //     }
    //   }
    //   // detailBadgeData.forEach((badge) => {
    //   //   if (badge.pointId === initialData.pointId && badge.categoryId) {
    //   //     badge.color = categorySelect.value.split("-")[1];
    //   //     badge.sizing = parseFloat(sizingInput.value);
    //   //     badge.categoryId = categorySelect.value.split("-")[0];
    //   //     badge.text = categorySelect.value.split("-")[2];
    //   //   } else if (badge.pointId === initialData.pointId && badge.memberId) {
    //   //     badge.sizing = parseFloat(sizingInput.value);
    //   //     badge.memberId = memberIdSelect.value.split("-")[0];
    //   //     badge.text = parseFloat(sizingInput.value);
    //   //     badge.sizing = parseFloat(sizingInput.value);
    //   //     badge.title = memberIdSelect.value.split("-")[1];
    //   //   }
    //   // });
    //   console.log("detailBadgeDatadetailBadgeData",detailBadgeData)
    //   t.set("card", "shared", "detailBadgeData", detailBadgeData)
    //     // .then(() => t.closePopup())
    //     .catch((error) => console.log(error));
    // });
  });
});

function FetchAndPaint(t) {
  return t
    .get("card", "shared", "detailBadgeData")
    .then(function (detailBadgeData) {
      return t
        .card("id")
        .get("id")
        .then(function (cardId) {
          return fetch(`${ENDPOINT_URL}/cards/${cardId}`)
            .then((response) => response.json())
            .then((data) => {
              console.log("datadatadatadatadata", data);
              let detailBadges = [];
              if (data.data) {
                let memberBadges = [];
                data.data.members.forEach((member) => {
                  console.log(member);
                  if (member?.memberId?._id) {
                    memberBadges.push({
                      title: member.memberId.name,
                      text: member.sizing,
                      sizing: member.sizing,
                      color: "red",
                      memberId: member.memberId._id,
                      cardId: cardId,
                      listId: data.data.listId,
                      pointId: member._id,
                      callback: function (t) {
                        // Fetch initial data
                        //fetch
                        const initialFormData = {
                          cardId: cardId,
                          pointId: member._id,
                        };
                        return t.popup({
                          title: "Adjust Member Sizing",
                          url: "./adjust-size.html",
                          args: { initialFormData },
                          height: 240,
                        });
                      },
                    });
                    console.log(
                      "memberBadgesmemberBadgesmemberBadges",
                      memberBadges
                    );
                  }
                });
                const categoriesBadges = data.data.members
                  // First, reduce to unique categories
                  .reduce((uniqueCategories, member) => {
                    if (
                      !uniqueCategories.some(
                        (uc) => uc.categoryId?._id === member.categoryId?._id
                      )
                    ) {
                      uniqueCategories.push(member);
                    }
                    return uniqueCategories;
                  }, [])
                  .filter((member) => member.categoryId)
                  .map((member) => {
                    const categoryBadge = {
                      title: "",
                      text: member.categoryId.name,
                      sizing: member.sizing,
                      color: member.categoryId.color,
                      cardId: cardId,
                      categoryId: member.categoryId._id,
                      pointId: member._id,
                      listId: data.data.listId,
                      // callback: function (t) {
                      //   // Fetch initial data
                      //   //fetch
                      //   const initialFormData = {
                      //     cardId: cardId,
                      //     pointId: member._id,
                      //     listId: data.data.listId
                      //   };
                      //   return t.popup({
                      //     title: "Adjust Member Sizing",
                      //     url: "./adjust-size.html",
                      //     args: { initialFormData },
                      //     height: 240,
                      //   });
                      // },
                    };
                    console.log("Unique Category Badge:", categoryBadge);
                    return categoryBadge;
                  });

                const typesBadges = data.data.types.map((type) => ({
                  text: type.name,
                  color: type.color,
                  icon: type.icon,
                  typeId: type.id,
                  cardId: cardId,
                  listId: data.data.listId,

                  callback: function (t) {
                    // Logic to handle type deletion
                    const deleteData = {
                      typeId: type.id,
                      cardId: cardId,
                    };
                    console.log("deleteData", deleteData);
                    fetch(`${ENDPOINT_URL}/cards/delete-type`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(deleteData),
                    })
                      .then((response) => response.json())
                      .then((responseData) => {
                        // Remove the type from the badgeData
                        const updatedDetailBadges = detailBadgeData.filter(
                          (badge) => badge.typeId !== type.id
                        );
                        return t.set(
                          "card",
                          "shared",
                          "detailBadgeData",
                          updatedDetailBadges
                        );
                      })
                      .catch((error) => {
                        console.error("Error deleting type:", error);
                      });
                  },
                }));

                detailBadges = [
                  ...memberBadges,
                  ...categoriesBadges,
                  ...typesBadges,
                ];
                console.log("detailBadges", detailBadges);
              }

              // Store the badge data in pluginData for future use
              return t
                .set("card", "shared", "detailBadgeData", detailBadges)
                .then(() => {
                  return detailBadges;
                });
            });
        });
    });
}
