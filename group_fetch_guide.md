curl -X 'GET' \
  'http://178.18.245.131:3000/api/default/groups' \
  -H 'accept: application/json' \
  -H 'X-Api-Key: b7f9d2a1e8c4f5b6a9d0c3e7f1a2b4c6d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3'

  response be like this : 

  [
  {
    "groupMetadata": {
      "id": {
        "server": "g.us",
        "user": "120363422774744537",
        "_serialized": "120363422774744537@g.us"
      },
      "creation": 1765952886,
      "owner": {
        "server": "lid",
        "user": "163364097540172",
        "_serialized": "163364097540172@lid"
      },
      "subject": "Test",
      "restrict": false,
      "announce": false,
      "noFrequentlyForwarded": false,
      "ephemeralDuration": 0,
      "membershipApprovalMode": false,
      "memberAddMode": "all_member_add",
      "reportToAdminMode": false,
      "support": false,
      "suspended": false,
      "terminated": false,
      "uniqueShortNameMap": {},
      "isLidAddressingMode": true,
      "isParentGroup": false,
      "isParentGroupClosed": false,
      "defaultSubgroup": false,
      "generalSubgroup": false,
      "hiddenSubgroup": false,
      "groupSafetyCheck": false,
      "generalChatAutoAddDisabled": false,
      "allowNonAdminSubGroupCreation": false,
      "lastReportToAdminTimestamp": null,
      "hasCapi": false,
      "participants": [
        {
          "id": {
            "server": "c.us",
            "user": "252614129486",
            "_serialized": "252614129486@c.us"
          },
          "isAdmin": false,
          "isSuperAdmin": false
        },
        {
          "id": {
            "server": "c.us",
            "user": "252612354499",
            "_serialized": "252612354499@c.us"
          },
          "isAdmin": false,
          "isSuperAdmin": false
        },
        {
          "id": {
            "server": "c.us",
            "user": "252616981411",
            "_serialized": "252616981411@c.us"
          },
          "isAdmin": false,
          "isSuperAdmin": false
        },
        {
          "id": {
            "server": "c.us",
            "user": "252617953651",
            "_serialized": "252617953651@c.us"
          },
          "isAdmin": false,
          "isSuperAdmin": false
        },
        {
          "id": {
            "server": "c.us",
            "user": "252612051980",
            "_serialized": "252612051980@c.us"
          },
          "isAdmin": false,
          "isSuperAdmin": false
        },
        {
          "id": {
            "server": "c.us",
            "user": "252611430930",
            "_serialized": "252611430930@c.us"
          },
          "isAdmin": true,
          "isSuperAdmin": false
        },
        {
          "id": {
            "server": "c.us",
            "user": "252619328609",
            "_serialized": "252619328609@c.us"
          },
          "isAdmin": true,
          "isSuperAdmin": true
        },
        {
          "id": {
            "server": "c.us",
            "user": "252613949671",
            "_serialized": "252613949671@c.us"
          },
          "isAdmin": false,
          "isSuperAdmin": false
        },
        {
          "id": {
            "server": "c.us",
            "user": "252770527872",
            "_serialized": "252770527872@c.us"
          },
          "isAdmin": false,
          "isSuperAdmin": false
        }
      ],
      "pendingParticipants": [],
      "pastParticipants": [
        {
          "id": {
            "server": "lid",
            "user": "262517477654640",
            "_serialized": "262517477654640@lid"
          },
          "leaveTs": 1768749236,
          "leaveReason": "Removed"
        },
        {
          "id": {
            "server": "lid",
            "user": "98432345743537",
            "_serialized": "98432345743537@lid"
          },
          "leaveTs": 1768749213,
          "leaveReason": "Removed"
        },
        {
          "id": {
            "server": "lid",
            "user": "176403299463418",
            "_serialized": "176403299463418@lid"
          },
          "leaveTs": 1768316995,
          "leaveReason": "Left"
        },
        {
          "id": {
            "server": "lid",
            "user": "63162141417638",
            "_serialized": "63162141417638@lid"
          },
          "leaveTs": 1768315575,
          "leaveReason": "Left"
        },
        {
          "id": {
            "server": "lid",
            "user": "208413875261667",
            "_serialized": "208413875261667@lid"
          },
          "leaveTs": 1768300249,
          "leaveReason": "Left"
        }
      ],
      "membershipApprovalRequests": [],
      "subgroupSuggestions": []
    },
    "id": {
      "server": "g.us",
      "user": "120363422774744537",
      "_serialized": "120363422774744537@g.us"
    },
    "name": "Test",
    "isGroup": true,
    "isReadOnly": false,
    "unreadCount": 0,
    "timestamp": 1768747626,
    "archived": false,
    "pinned": false,
    "isMuted": false,
    "muteExpiration": 0,
    "lastMessage": {
      "_data": {
        "id": {
          "fromMe": true,
          "remote": "120363422774744537@g.us",
          "id": "255945813",
          "participant": {
            "server": "c.us",
            "user": "252619328609",
            "_serialized": "252619328609@c.us"
          },
          "_serialized": "true_120363422774744537@g.us_255945813_252619328609@c.us"
        },
        "viewed": false,
        "type": "gp2",
        "subtype": "remove",
        "t": 1768749236,
        "notifyName": "",
        "from": {
          "server": "c.us",
          "user": "252619328609",
          "_serialized": "252619328609@c.us"
        },
        "to": {
          "server": "g.us",
          "user": "120363422774744537",
          "_serialized": "120363422774744537@g.us"
        },
        "author": {
          "server": "lid",
          "user": "161456746160168",
          "_serialized": "161456746160168@lid"
        },
        "ack": 0,
        "invis": false,
        "star": false,
        "kicNotified": false,
        "isFromTemplate": false,
        "isAdsMedia": false,
        "pollInvalidated": false,
        "isSentCagPollCreation": false,
        "latestEditMsgKey": null,
        "latestEditSenderTimestampMs": null,
        "recipients": [
          {
            "server": "lid",
            "user": "262517477654640",
            "_serialized": "262517477654640@lid"
          }
        ],
        "mentionedJidList": [],
        "groupMentions": [],
        "isEventCanceled": false,
        "eventInvalidated": false,
        "isVcardOverMmsDocument": false,
        "isForwarded": false,
        "isQuestion": false,
        "questionReplyQuotedMessage": null,
        "questionResponsesCount": 0,
        "readQuestionResponsesCount": 0,
        "forwardsCount": 0,
        "labels": [],
        "hasReaction": false,
        "viewMode": "VISIBLE",
        "productHeaderImageRejected": false,
        "lastPlaybackProgress": 0,
        "isDynamicReplyButtonsMsg": false,
        "isCarouselCard": false,
        "parentMsgId": null,
        "callSilenceReason": null,
        "isVideoCall": false,
        "callDuration": null,
        "callCreator": null,
        "callParticipants": null,
        "isCallLink": null,
        "callLinkToken": null,
        "isMdHistoryMsg": false,
        "stickerSentTs": 0,
        "isAvatar": false,
        "lastUpdateFromServerTs": 0,
        "invokedBotWid": null,
        "botTargetSenderJid": null,
        "bizBotType": null,
        "botResponseTargetId": null,
        "botPluginType": null,
        "botPluginReferenceIndex": null,
        "botPluginSearchProvider": null,
        "botPluginSearchUrl": null,
        "botPluginSearchQuery": null,
        "botPluginMaybeParent": false,
        "botReelPluginThumbnailCdnUrl": null,
        "botMessageDisclaimerText": null,
        "botSessionTransparencyType": null,
        "botMsgBodyType": null,
        "reportingTokenInfo": null,
        "requiresDirectConnection": false,
        "bizContentPlaceholderType": null,
        "hostedBizEncStateMismatch": false,
        "senderOrRecipientAccountTypeHosted": false,
        "placeholderCreatedWhenAccountIsHosted": false,
        "groupHistoryBundleMessageKey": null,
        "groupHistoryBundleMetadata": null,
        "groupHistoryIndividualMessageInfo": null,
        "nonJidMentions": null,
        "links": []
      },
      "id": {
        "fromMe": true,
        "remote": "120363422774744537@g.us",
        "id": "255945813",
        "participant": {
          "server": "c.us",
          "user": "252619328609",
          "_serialized": "252619328609@c.us"
        },
        "_serialized": "true_120363422774744537@g.us_255945813_252619328609@c.us"
      },
      "ack": 0,
      "hasMedia": false,
      "body": "",
      "type": "gp2",
      "timestamp": 1768749236,
      "from": "252619328609@c.us",
      "to": "120363422774744537@g.us",
      "author": "161456746160168@lid",
      "deviceType": "web",
      "isForwarded": false,
      "forwardingScore": 0,
      "isStatus": false,
      "isStarred": false,
      "fromMe": true,
      "hasQuotedMsg": false,
      "hasReaction": false,
      "vCards": [],
      "mentionedIds": [],
      "groupMentions": [],
      "isGif": false,
      "links": []
    }
  },
  {
    "groupMetadata": {
      "id": {
        "server": "g.us",
        "user": "120363422601253535",
        "_serialized": "120363422601253535@g.us"
      },
      "creation": 1764768751,
      "owner": {
        "server": "lid",
        "user": "163364097540172",
        "_serialized": "163364097540172@lid"
      },
      "subject": "Somcharge auto operator",
      "restrict": false,
      "announce": false,
      "noFrequentlyForwarded": false,
      "ephemeralDuration": 0,
      "membershipApprovalMode": false,
      "memberAddMode": "all_member_add",
      "reportToAdminMode": false,
      "support": false,
      "suspended": false,
      "terminated": false,
      "uniqueShortNameMap": {},
      "isLidAddressingMode": true,
      "isParentGroup": false,
      "isParentGroupClosed": false,
      "defaultSubgroup": false,
      "generalSubgroup": false,
      "hiddenSubgroup": false,
      "groupSafetyCheck": false,
      "generalChatAutoAddDisabled": false,
      "allowNonAdminSubGroupCreation": false,
      "lastReportToAdminTimestamp": null,
      "hasCapi": false,
      "participants": [
        {
          "id": {
            "server": "c.us",
            "user": "252616981411",
            "_serialized": "252616981411@c.us"
          },
          "isAdmin": false,
          "isSuperAdmin": false
        },
        {
          "id": {
            "server": "c.us",
            "user": "252611430930",
            "_serialized": "252611430930@c.us"
          },
          "isAdmin": false,
          "isSuperAdmin": false
        },
        {
          "id": {
            "server": "c.us",
            "user": "252619328609",
            "_serialized": "252619328609@c.us"
          },
          "isAdmin": true,
          "isSuperAdmin": true
        }
      ],
      "pendingParticipants": [],
      "pastParticipants": [],
      "membershipApprovalRequests": [],
      "subgroupSuggestions": []
    },
    "id": {
      "server": "g.us",
      "user": "120363422601253535",
      "_serialized": "120363422601253535@g.us"
    },
    "name": "Somcharge auto operator",
    "isGroup": true,
    "isReadOnly": false,
    "unreadCount": 0,
    "timestamp": 1764775896,
    "archived": false,
    "pinned": false,
    "isMuted": false,
    "muteExpiration": 0,
    "lastMessage": {
      "_data": {
        "id": {
          "fromMe": false,
          "remote": "120363422601253535@g.us",
          "id": "ACEBE143B69ED1C3FD38283450454203",
          "participant": {
            "server": "lid",
            "user": "161456746160168",
            "_serialized": "161456746160168@lid"
          },
          "_serialized": "false_120363422601253535@g.us_ACEBE143B69ED1C3FD38283450454203_161456746160168@lid"
        },
        "viewed": false,
        "body": "Oky eng",
        "type": "chat",
        "t": 1764775896,
        "notifyName": "",
        "from": {
          "server": "g.us",
          "user": "120363422601253535",
          "_serialized": "120363422601253535@g.us"
        },
        "to": {
          "server": "c.us",
          "user": "252619328609",
          "_serialized": "252619328609@c.us"
        },
        "author": {
          "server": "lid",
          "user": "161456746160168",
          "_serialized": "161456746160168@lid"
        },
        "ack": 0,
        "invis": false,
        "star": false,
        "kicNotified": false,
        "isFromTemplate": false,
        "isAdsMedia": false,
        "pollInvalidated": false,
        "isSentCagPollCreation": false,
        "latestEditMsgKey": null,
        "latestEditSenderTimestampMs": null,
        "broadcast": false,
        "mentionedJidList": [],
        "groupMentions": [],
        "isEventCanceled": false,
        "eventInvalidated": false,
        "isVcardOverMmsDocument": false,
        "isForwarded": false,
        "isQuestion": false,
        "questionReplyQuotedMessage": null,
        "questionResponsesCount": 0,
        "readQuestionResponsesCount": 0,
        "forwardsCount": 0,
        "labels": [],
        "hasReaction": false,
        "viewMode": "VISIBLE",
        "messageSecret": {
          "0": 120,
          "1": 249,
          "2": 208,
          "3": 119,
          "4": 108,
          "5": 9,
          "6": 209,
          "7": 207,
          "8": 77,
          "9": 61,
          "10": 110,
          "11": 150,
          "12": 250,
          "13": 11,
          "14": 88,
          "15": 43,
          "16": 31,
          "17": 137,
          "18": 207,
          "19": 142,
          "20": 24,
          "21": 87,
          "22": 250,
          "23": 189,
          "24": 185,
          "25": 181,
          "26": 175,
          "27": 28,
          "28": 143,
          "29": 155,
          "30": 127,
          "31": 209
        },
        "productHeaderImageRejected": false,
        "lastPlaybackProgress": 0,
        "isDynamicReplyButtonsMsg": false,
        "isCarouselCard": false,
        "parentMsgId": null,
        "callSilenceReason": null,
        "isVideoCall": false,
        "callDuration": null,
        "callCreator": null,
        "callParticipants": null,
        "isCallLink": null,
        "callLinkToken": null,
        "isMdHistoryMsg": false,
        "stickerSentTs": 0,
        "isAvatar": false,
        "lastUpdateFromServerTs": 0,
        "invokedBotWid": null,
        "botTargetSenderJid": null,
        "bizBotType": null,
        "botResponseTargetId": null,
        "botPluginType": null,
        "botPluginReferenceIndex": null,
        "botPluginSearchProvider": null,
        "botPluginSearchUrl": null,
        "botPluginSearchQuery": null,
        "botPluginMaybeParent": false,
        "botReelPluginThumbnailCdnUrl": null,
        "botMessageDisclaimerText": null,
        "botSessionTransparencyType": null,
        "botMsgBodyType": null,
        "reportingTokenInfo": null,
        "requiresDirectConnection": false,
        "bizContentPlaceholderType": null,
        "hostedBizEncStateMismatch": false,
        "senderOrRecipientAccountTypeHosted": false,
        "placeholderCreatedWhenAccountIsHosted": false,
        "groupHistoryBundleMessageKey": null,
        "groupHistoryBundleMetadata": null,
        "groupHistoryIndividualMessageInfo": null,
        "nonJidMentions": null,
        "links": []
      },
      "id": {
        "fromMe": false,
        "remote": "120363422601253535@g.us",
        "id": "ACEBE143B69ED1C3FD38283450454203",
        "participant": {
          "server": "lid",
          "user": "161456746160168",
          "_serialized": "161456746160168@lid"
        },
        "_serialized": "false_120363422601253535@g.us_ACEBE143B69ED1C3FD38283450454203_161456746160168@lid"
      },
      "ack": 0,
      "hasMedia": false,
      "body": "Oky eng",
      "type": "chat",
      "timestamp": 1764775896,
      "from": "120363422601253535@g.us",
      "to": "252619328609@c.us",
      "author": "161456746160168@lid",
      "deviceType": "android",
      "isForwarded": false,
      "forwardingScore": 0,
      "isStatus": false,
      "isStarred": false,
      "broadcast": false,
      "fromMe": false,
      "hasQuotedMsg": false,
      "hasReaction": false,
      "vCards": [],
      "mentionedIds": [],
      "groupMentions": [],
      "isGif": false,
      "links": []
    }
  },
  {
    "groupMetadata": {
      "id": {
        "server": "g.us",
        "user": "120363404094925758",
        "_serialized": "120363404094925758@g.us"
      },
      "creation": 1764769861000,
      "owner": {
        "server": "lid",
        "user": "163364097540172",
        "_serialized": "163364097540172@lid"
      },
      "subject": "string",
      "suspended": false,
      "terminated": false,
      "uniqueShortNameMap": {},
      "isParentGroup": false,
      "defaultSubgroup": false,
      "participants": [],
      "pendingParticipants": [],
      "pastParticipants": [
        {
          "id": {
            "server": "c.us",
            "user": "252619328609",
            "_serialized": "252619328609@c.us"
          },
          "leaveTs": 1764769967,
          "leaveReason": "Left"
        }
      ],
      "membershipApprovalRequests": [],
      "subgroupSuggestions": []
    },
    "id": {
      "server": "g.us",
      "user": "120363404094925758",
      "_serialized": "120363404094925758@g.us"
    },
    "name": "string",
    "isGroup": true,
    "unreadCount": 0,
    "timestamp": 1764769861,
    "archived": false,
    "pinned": false,
    "isMuted": false,
    "muteExpiration": 0,
    "lastMessage": {
      "_data": {
        "id": {
          "fromMe": true,
          "remote": "120363404094925758@g.us",
          "id": "A581D3E6544798AFBE4A006B319CDC39",
          "participant": {
            "server": "c.us",
            "user": "252619328609",
            "_serialized": "252619328609@c.us"
          },
          "_serialized": "true_120363404094925758@g.us_A581D3E6544798AFBE4A006B319CDC39_252619328609@c.us"
        },
        "viewed": false,
        "type": "gp2",
        "subtype": "leave",
        "t": 1764769967,
        "notifyName": "",
        "from": {
          "server": "c.us",
          "user": "252619328609",
          "_serialized": "252619328609@c.us"
        },
        "to": {
          "server": "g.us",
          "user": "120363404094925758",
          "_serialized": "120363404094925758@g.us"
        },
        "author": {
          "server": "c.us",
          "user": "252619328609",
          "_serialized": "252619328609@c.us"
        },
        "ack": 0,
        "invis": false,
        "star": false,
        "kicNotified": false,
        "isFromTemplate": false,
        "isAdsMedia": false,
        "pollInvalidated": false,
        "isSentCagPollCreation": false,
        "latestEditMsgKey": null,
        "latestEditSenderTimestampMs": null,
        "recipients": [
          {
            "server": "c.us",
            "user": "252619328609",
            "_serialized": "252619328609@c.us"
          }
        ],
        "mentionedJidList": [],
        "groupMentions": [],
        "isEventCanceled": false,
        "eventInvalidated": false,
        "isVcardOverMmsDocument": false,
        "isForwarded": false,
        "isQuestion": false,
        "questionReplyQuotedMessage": null,
        "questionResponsesCount": 0,
        "readQuestionResponsesCount": 0,
        "forwardsCount": 0,
        "labels": [],
        "hasReaction": false,
        "viewMode": "VISIBLE",
        "productHeaderImageRejected": false,
        "lastPlaybackProgress": 0,
        "isDynamicReplyButtonsMsg": false,
        "isCarouselCard": false,
        "parentMsgId": null,
        "callSilenceReason": null,
        "isVideoCall": false,
        "callDuration": null,
        "callCreator": null,
        "callParticipants": null,
        "isCallLink": null,
        "callLinkToken": null,
        "isMdHistoryMsg": false,
        "stickerSentTs": 0,
        "isAvatar": false,
        "lastUpdateFromServerTs": 0,
        "invokedBotWid": null,
        "botTargetSenderJid": null,
        "bizBotType": null,
        "botResponseTargetId": null,
        "botPluginType": null,
        "botPluginReferenceIndex": null,
        "botPluginSearchProvider": null,
        "botPluginSearchUrl": null,
        "botPluginSearchQuery": null,
        "botPluginMaybeParent": false,
        "botReelPluginThumbnailCdnUrl": null,
        "botMessageDisclaimerText": null,
        "botSessionTransparencyType": null,
        "botMsgBodyType": null,
        "reportingTokenInfo": null,
        "requiresDirectConnection": false,
        "bizContentPlaceholderType": null,
        "hostedBizEncStateMismatch": false,
        "senderOrRecipientAccountTypeHosted": false,
        "placeholderCreatedWhenAccountIsHosted": false,
        "groupHistoryBundleMessageKey": null,
        "groupHistoryBundleMetadata": null,
        "groupHistoryIndividualMessageInfo": null,
        "nonJidMentions": null,
        "links": []
      },
      "id": {
        "fromMe": true,
        "remote": "120363404094925758@g.us",
        "id": "A581D3E6544798AFBE4A006B319CDC39",
        "participant": {
          "server": "c.us",
          "user": "252619328609",
          "_serialized": "252619328609@c.us"
        },
        "_serialized": "true_120363404094925758@g.us_A581D3E6544798AFBE4A006B319CDC39_252619328609@c.us"
      },
      "ack": 0,
      "hasMedia": false,
      "body": "",
      "type": "gp2",
      "timestamp": 1764769967,
      "from": "252619328609@c.us",
      "to": "120363404094925758@g.us",
      "author": "252619328609@c.us",
      "deviceType": "android",
      "isForwarded": false,
      "forwardingScore": 0,
      "isStatus": false,
      "isStarred": false,
      "fromMe": true,
      "hasQuotedMsg": false,
      "hasReaction": false,
      "vCards": [],
      "mentionedIds": [],
      "groupMentions": [],
      "isGif": false,
      "links": []
    }
  }
]