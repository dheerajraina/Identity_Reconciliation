# Identity_Reconciliation

Queries Here :-dheerajraina55@gmail.com or github.com/dheerajraina



Welcome to my submission



Firstly, I would like to thank you for providing the oppurtunity to learn something new

if you would like to clear all the data in the table first use this endpoint:
        https://identity-reconciliation-g1se.onrender.com/clear-identify

then this:
        API ENDPOINT= https://identity-reconciliation-g1se.onrender.com/identify

There were a few questions that I asked myself and same I will ask to you too, pardon me if the answer to these is already present in the problem description, maybe i didn't notice

Question 1:
if this the current DB state :
{
id 11
phoneNumber "919191"
email "george@hillvalley.edu"
linkedId null
linkPrecedence "primary"
createdAt 2023-04-11 00:00:00.374+00
updatedAt 2023-04-11 00:00:00.374+00
deletedAt null
},
{
id 27
phoneNumber "717171"
email "biffsucks@hillvalley.edu"
linkedId null
linkPrecedence "primary"
createdAt 2023-04-21 05:30:00.11+00
updatedAt 2023-04-21 05:30:00.11+00
deletedAt null
},
{
id 29
phoneNumber "717176"
email "biffsucks@hillvalley.edu"
linkedId 27
linkPrecedence "secondary"
createdAt 2023-04-21 05:30:00.11+00
updatedAt 2023-04-21 05:30:00.11+00
deletedAt null
}

        And after sending the following data in the payload :
                {
                "email":"george@hillvalley.edu",
                "phoneNumber": "717171"
                }
                Record with id 27 becomes secondary

        the question arises whether or not the all the secondary contacts connected to id 27 will update and become secondary contacts of id 11

        So for now i am making that happen i.e whenever primary contact turns to secondary contact all its linked contacts also update and become secondary contacts of the which there erstwhile primary contact is now a secondary contact

Question 2:
Suppose given below is the current DB state:
{
id 11
phoneNumber "919191"
email "george@hillvalley.edu"
linkedId null
linkPrecedence "primary"
createdAt 2023-04-11 00:00:00.374+00
updatedAt 2023-04-11 00:00:00.374+00
deletedAt null
},
{
id 27
phoneNumber "717171"
email "biffsucks@hillvalley.edu"
linkedId 11
linkPrecedence "secondary"
createdAt 2023-04-21 05:30:00.11+00
updatedAt 2023-04-28 06:40:00.23+00
deletedAt null
}

        and the following payload is passed :
                {
                "email":"xyz@hillvalley.edu",
                "phoneNumber": "717171"
                }

                so will the new secondary contact be linked to id 27 which has a common phoneNumber with it or id 11 to which id 27 is linked

        for now i am given preference to the higher precedence i.e if payload has some thing in common with some secondary contact it becomes linked to the primary contact linked to that secondary contact





        If you read upto here, thanks a lot you are a kind person!!
