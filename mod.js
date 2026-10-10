(function () {
  "use strict";
  if (window.__srMenu) return console.log("Snow Rider menu already loaded");

  // field table pulled from the game's wasm: class -> [name, offset, type, isStatic]
  // types: i=int f=float b=bool h=short l=long d=double p=object pointer s=string t=struct
  const FIELDS = {"GameManagerGD":[["gameControlText",12,"p:Text",0],["rewardedAdText",16,"p:Text",0]],"GameDistribution":[["Instance",0,"p:GameDistribution",1],["GAME_KEY",12,"s",0],["OnResumeGame",4,"p:Action",1],["OnPauseGame",8,"p:Action",1],["OnRewardedVideoSuccess",12,"p:Action",1],["OnRewardedVideoFailure",16,"p:Action",1],["OnPreloadRewardedVideo",20,"p",1],["_isRewardedVideoLoaded",16,"b",0]],"GameDistributionSdk":[["instance",0,"p:GameDistributionSdk",1],["isPauseGameCalled",12,"b",0],["IsMouseLockedLastly",13,"b",0],["isRewardRequested",14,"b",0],["isInterstitialRequested",15,"b",0],["AllowGamePause",16,"b",0],["rewardCallBack",20,"p",0]],"AdControl":[["instance",0,"p:AdControl",1],["OnAdCompleted",4,"p:UnityEvent",1],["maxTime",12,"i",0],["waitTime",16,"i",0],["playTime",20,"f",0],["startTime",24,"f",0]],"alala":[["image",12,"p:Image",0],["facebook_id",16,"s",0],["currUser",20,"p:FBUser",0],["nextUser",24,"p:FBUser",0]],"FBUser":[["facebook_id",8,"s",0],["score",12,"i",0],["sprite",16,"p:Sprite",0]],"BackgroundRoll":[["delay",12,"f",0],["backAnimationTime",16,"f",0],["isVisible",20,"b",0]],"BestIndicator":[["score",12,"p:GameObject",0],["image",16,"p:Image",0]],"BiomeData":[["name",12,"s",0],["minLength",16,"i",0],["maxLength",20,"i",0],["structs",24,"p",0]],"CameraControlC":[["instance",0,"p:CameraControlC",1],["sledgeControl",12,"p:PlayerControl",0],["rotationAmplify",16,"t:Vector3",0],["positionOffset",28,"t:Vector3",0],["pivotTargetPos",40,"t:Vector3",0],["camTargetPos",52,"t:Vector3",0],["pivotTargetRot",64,"t:Quaternion",0],["camTargetRot",80,"t:Quaternion",0],["camOffsetPos",96,"t:Vector3",0],["cam",108,"p:Transform",0],["target",112,"p:Transform",0],["isLocked",116,"b",0],["currentRotX",120,"f",0],["currentRotY",124,"f",0],["rotDirection",128,"f",0],["currentMenu",132,"i",0],["menuCount",136,"i",0],["menuRotAngle",140,"f",0],["targetMenuAngle",144,"f",0],["startMousePos",148,"t:Vector2",0],["endMousePos",156,"t:Vector2",0],["minSwipeDist",164,"f",0],["spd",168,"f",0],["startDistance",172,"f",0],["startRot",176,"t:Quaternion",0],["startPos",192,"t:Vector3",0],["startTime",204,"f",0],["startPressTime",208,"f",0]],"CampControl":[["campPrefab",12,"p:ScriptableObj",0],["instance",0,"p:CampControl",1],["camp",16,"p:GameObject",0]],"CanvasControl":[["elements",12,"p",0],["activeElements",16,"f",0]],"CanvasManager":[["instance",0,"p:CanvasManager",1],["OnHide",4,"p:UnityEvent",1],["OnShow",8,"p:UnityEvent",1],["currCanvas",12,"p:CanvasControl",0]],"Chunk":[["data",8,"p:ScriptableObj",0]],"ChunkObj":[["prefab",8,"p:GameObject",0],["pos",12,"t:Vector3",0],["rot",24,"t:Quaternion",0],["scale",40,"t:Vector3",0]],"CloudControl":[["cloudPrefab",12,"p:GameObject",0],["distanceBetween",16,"f",0],["randomness",20,"f",0],["cloudSize",24,"f",0],["cloudCountX",28,"i",0],["cloudCountY",32,"i",0]],"CollisionRay":[["rayLenght",12,"f",0],["ray",16,"t:Ray",0],["hit",40,"t:RaycastHit",0],["mask",84,"t:LayerMask",0]],"ControlMode":[["value__",8,"i",0],["none",0,"t:ControlMode",1],["sided",0,"t:ControlMode",1],["tilt",0,"t:ControlMode",1]],"Crack":[["nextStructure",12,"p:StructData",0]],"CrackStart":[["nextStructure",12,"p:StructData",0],["rampPrefab",16,"p:ScriptableObj",0],["sideRampprefab",20,"p:ScriptableObj",0]],"DataText":[["variableName",12,"s",0],["text",16,"p:Text",0]],"Delta":[["textObj",12,"p:Text",0],["bufferLength",16,"i",0],["i",20,"i",0],["num",24,"i",0],["frames",28,"p",0]],"Demo":[["vectorArray",12,"p",0],["colorList",16,"p",0],["textureArray",20,"p",0],["intArray",24,"p",0],["classicFloatArray",28,"p",0],["classicTextureArray",32,"p",0],["classicVector3Array",36,"p",0],["playerArray",40,"p",0],["playerList",44,"p",0],["customDrawers",48,"p",0]],"DestructibleObj":[["prefab",12,"p:ScriptableObj",0]],"FacebookButton":[["enabledSprite",12,"p:Sprite",0],["disabledSprite",16,"p:Sprite",0]],"FacebookEndControl":[["connectBlock",12,"p:GameObject",0],["friendsBlock",16,"p:GameObject",0]],"FacebookFriends":[["friendPrefab",12,"p:GameObject",0],["inviteButtonPrefab",16,"p:GameObject",0],["scrollList",20,"p:GameObject",0]],"FacebookFriendsData":[["friends",12,"p",0],["storedData",0,"p",1],["spriteResult",16,"p",0]],"Friend":[["name",8,"s",0],["score",12,"i",0],["sprite",16,"p:Sprite",0]],"FacebookScores":[["data",8,"p",0]],"FacebookData":[["score",8,"i",0],["user",12,"p:FacebookUser",0]],"FacebookUser":[["name",8,"s",0],["id",12,"s",0]],"StoredData":[["name",8,"s",0],["id",12,"s",0],["score",16,"i",0],["sprite",20,"p",0]],"FacebookManager":[["OnConnect",0,"p:UnityEvent",1],["instance",4,"p:FacebookManager",1]],"FacebookTarget":[["targetImage",12,"p:Image",0],["targetText",16,"p:Text",0],["targetObject",20,"p:GameObject",0],["currTarget",24,"p:Friend",0],["nextTarget",28,"p:Friend",0],["foundTarget",32,"b",0],["canGetTarget",33,"b",0],["thereAreMoreTargets",34,"b",0]],"Floats":[["nextStructure",12,"p:StructData",0]],"FloatsEndMod":[["nextStructure",12,"p:StructData",0]],"FollowTransform":[["onlyZ",12,"b",0],["pivotPosition",16,"t:Vector3",0],["target",28,"p:Transform",0],["positionOffset",32,"f",0]],"FriendsData":[["friends",12,"p",0],["currentImage",16,"p",0],["adapterData",20,"p",0],["savePath",24,"s",0],["updateMode",28,"t:UpdateMode",0],["instance",0,"p:FriendsData",1]],"UpdateMode":[["value__",8,"i",0],["Full",0,"t:UpdateMode",1],["Partial",0,"t:UpdateMode",1],["Self",0,"t:UpdateMode",1],["Local",0,"t:UpdateMode",1],["None",0,"t:UpdateMode",1]],"AdapterData":[["name",8,"s",0],["id",12,"s",0],["score",16,"i",0],["sprite",20,"p",0]],"FyberControl":[["appId",12,"s",0],["token",16,"s",0],["instance",0,"p:FyberControl",1]],"GameControl":[["giftsThisGame",0,"i",1],["bestNow",4,"b",1],["shadowDistStart",8,"f",1],["shadowDistPlay",12,"f",1],["shadowDistEnd",16,"f",1],["startTransitionDur",20,"f",1],["playStartTransitionDur",24,"f",1],["playTransitionDur",28,"f",1],["startTransitionDel",32,"f",1],["score",36,"i",1],["gameMode",40,"t:GameMode",1],["OnIntro",44,"p:UnityEvent",1],["OnEndIntro",48,"p:UnityEvent",1],["OnPlay",52,"p:UnityEvent",1],["OnStartPlay",56,"p:UnityEvent",1],["OnEnd",60,"p:UnityEvent",1],["OnGenChunk",64,"p:UnityEvent",1],["OnGetScore",68,"p:UnityEvent",1],["OnLand",72,"p:UnityEvent",1],["OnWait",76,"p:UnityEvent",1],["OnGetGift",80,"p:UnityEvent",1],["OnMain",84,"p:UnityEvent",1],["OnSleds",88,"p:UnityEvent",1],["OnShop",92,"p:UnityEvent",1],["OnSettings",96,"p:UnityEvent",1],["OnPurchase",100,"p:UnityEvent",1],["canProceed",104,"b",1],["_003C_003Ef__mg_0024cache0",108,"p:UnityAction",1],["_003C_003Ef__mg_0024cache1",112,"p:UnityAction",1],["_003C_003Ef__mg_0024cache2",116,"p:UnityAction",1],["_003C_003Ef__mg_0024cache3",120,"p:UnityAction",1],["_003C_003Ef__mg_0024cache4",124,"p:UnityAction",1],["_003C_003Ef__mg_0024cache5",128,"p:UnityAction",1]],"GameMode":[["value__",8,"i",0],["intro",0,"t:GameMode",1],["main",0,"t:GameMode",1],["play",0,"t:GameMode",1],["end",0,"t:GameMode",1]],"GenData":[["visibleStructCount",12,"i",0],["structWidth",16,"i",0],["chunkSize",20,"t:Vector2",0],["warmupLength",28,"i",0],["WarmupBiome",32,"p:BiomeData",0],["biomes",36,"p",0]],"GGen":[["giftChunk",12,"i",0],["mat",16,"p:Material",0],["shadowMat",20,"p:Material",0],["genData",24,"p:GenData",0],["randData",28,"p:RandData",0],["camp",32,"p:GameObject",0],["currentBiome",36,"p:BiomeData",0],["currentBiomeLength",40,"i",0],["currentStruct",44,"p:StructData",0],["structIndex",48,"i",0],["currentStructLength",52,"i",0],["structParent",56,"p:Transform",0],["structs",60,"p",0],["chunkIndex",64,"i",0],["target",68,"p:Transform",0],["generateDistance",72,"f",0],["currentChunksData",76,"p",0],["instance",0,"p:GGen",1],["moded",80,"b",0]],"Gift":[["DieSpeed",12,"f",0]],"GiftsGUI":[["text",12,"p:Text",0],["image",16,"p:GameObject",0]],"GUIControl":[["introCanvasPrefab",12,"p:GameObject",0],["playCanvasPrefab",16,"p:GameObject",0],["endCanvasPrefab",20,"p:GameObject",0],["sledsCanvasPrefab",24,"p:GameObject",0],["shopCanvasPrefab",28,"p:GameObject",0],["controlSelectCanvasPrefab",32,"p:GameObject",0],["waitCanvasPrefab",36,"p:GameObject",0],["tutorialCanvasPrefab",40,"p:GameObject",0],["rateCanvasPrefab",44,"p:GameObject",0],["likeCanvasPrefab",48,"p:GameObject",0],["pauseCanvasPrefab",52,"p:GameObject",0],["settingsCanvasPrefab",56,"p:GameObject",0],["purchaseCanvasPrefab",60,"p:GameObject",0],["currentCanvas",64,"p:GameObject",0],["instance",0,"p:GUIControl",1],["paused",68,"b",0]],"GUIEndControl":[["giftsBlock",12,"p:GameObject",0],["rankBlock",16,"p:GameObject",0]],"Hover":[["speed",12,"t:Vector3",0],["amplitude",24,"t:Vector3",0],["timeScaleEnabled",36,"b",0],["startPos",40,"t:Vector3",0],["time",52,"f",0]],"Images":[["clearImage",8,"p:Texture2D",0],["collapseImage",12,"p:Texture2D",0],["clearOnNewSceneImage",16,"p:Texture2D",0],["showTimeImage",20,"p:Texture2D",0],["showSceneImage",24,"p:Texture2D",0],["userImage",28,"p:Texture2D",0],["showMemoryImage",32,"p:Texture2D",0],["softwareImage",36,"p:Texture2D",0],["dateImage",40,"p:Texture2D",0],["showFpsImage",44,"p:Texture2D",0],["infoImage",48,"p:Texture2D",0],["searchImage",52,"p:Texture2D",0],["closeImage",56,"p:Texture2D",0],["buildFromImage",60,"p:Texture2D",0],["systemInfoImage",64,"p:Texture2D",0],["graphicsInfoImage",68,"p:Texture2D",0],["backImage",72,"p:Texture2D",0],["logImage",76,"p:Texture2D",0],["warningImage",80,"p:Texture2D",0],["errorImage",84,"p:Texture2D",0],["barImage",88,"p:Texture2D",0],["button_activeImage",92,"p:Texture2D",0],["even_logImage",96,"p:Texture2D",0],["odd_logImage",100,"p:Texture2D",0],["selectedImage",104,"p:Texture2D",0],["reporterScrollerSkin",108,"p:GUISkin",0]],"IntroCanvasDepth":[["canvas",12,"p:Canvas",0]],"JumpTutorial":[["s",12,"f",0]],"Letter":[["obj",8,"p:GameObject",0],["ascii",12,"h",0]],"listtest":[["a",12,"p",0]],"LocalizedText":[["stringName",12,"s",0]],"MagicSpell":[["name",8,"s",0],["target",12,"p:Object",0]],"MenuBlock":[["showEvent",12,"p:UnityEvent",0]],"MenuControler":[["back",12,"p:BackgroundRoll",0],["routineActive",16,"b",0],["Controls",20,"p:GameObject",0],["ControlsShowCount",0,"i",1],["hasTutAppeared",4,"b",1]],"MenuElement":[["delay",12,"f",0],["isVisible",16,"b",0],["showEvent",20,"p:UnityEvent",0]],"Obj":[["obj",8,"p:GameObject",0],["prefab",12,"p",0],["minRotOffset",16,"t:Vector3",0],["maxRotOffset",28,"t:Vector3",0],["scaleOffset",40,"t:Vector2",0]],"OnlineControl":[["gotScore",0,"b",1],["url",12,"s",0],["instance",4,"p:OnlineControl",1]],"ScoreInfo":[["id",8,"i",0],["rank",12,"i",0],["allRanks",16,"i",0]],"FacebookSetInfo":[["id",8,"i",0]],"OptimiseControl":[["clouds",12,"p:GameObject",0],["lagFrameCount",16,"i",0],["level",20,"i",0]],"PerlinShake":[["instance",0,"p:PerlinShake",1],["duration",12,"f",0],["speed",16,"f",0],["magnitude",20,"f",0],["cam",24,"p:CameraControlC",0]],"PhysicsExplosion":[["force",12,"f",0],["radius",16,"f",0]],"Player":[["name",8,"s",0],["obj",12,"p:GameObject",0],["items",16,"p",0],["life",20,"i",0],["damage",24,"f",0],["level",28,"i",0],["spells",32,"p",0]],"PlayerControl":[["data",12,"p:SledgeData",0],["genData",16,"p:GenData",0],["skinData",20,"p:SkinData",0],["collisionPoint",24,"p:SledgePoint",0],["sledgeModel",28,"p:Transform",0],["collisionRays",32,"p",0],["physicsSledgePrefab",36,"p:ScriptableObj",0],["rearParticles",40,"p:ParticleSystem",0],["physicsSledge",44,"p:GameObject",0],["hRot",48,"f",0],["vRot",52,"f",0],["moveSpeed",56,"f",0],["currMoveSpeed",60,"f",0],["maxTouchJumpDelta",64,"f",0],["touchLeftTime",68,"f",0],["touchRightTime",72,"f",0],["touchLeftPressed",76,"b",0],["touchRightPressed",77,"b",0],["touchLeftThisFrame",78,"b",0],["touchRightThisFrame",79,"b",0],["jumpStartTime",80,"f",0],["alreadyJumped",84,"b",0],["isGrounded",85,"b",0],["instance",0,"p:PlayerControl",1],["scoreCanvasPrefab",88,"p:GameObject",0],["scoreCanvas",92,"p:GameObject",0],["menuMaterial",96,"p:Material",0],["playMaterial",100,"p:Material",0],["prevMovSpeed",104,"f",0],["prevH",108,"f",0]],"PlayScore":[["scoreText",12,"p:Text",0]],"Popup":[["startScale",12,"t:Vector3",0],["startSize",24,"f",0],["popTime",28,"f",0],["playSound",32,"b",0]],"RandData":[["objects",12,"p",0]],"RateControl":[["titleText",12,"p:Text",0]],"Reporter":[["samples",12,"p",0],["logs",16,"p",0],["collapsedLogs",20,"p",0],["currentLog",24,"p",0],["logsDic",28,"p",0],["cachedString",32,"p",0],["show",36,"b",0],["collapse",37,"b",0],["clearOnNewSceneLoaded",38,"b",0],["showTime",39,"b",0],["showScene",40,"b",0],["showMemory",41,"b",0],["showFps",42,"b",0],["showGraph",43,"b",0],["showLog",44,"b",0],["showWarning",45,"b",0],["showError",46,"b",0],["numOfLogs",48,"i",0],["numOfLogsWarning",52,"i",0],["numOfLogsError",56,"i",0],["numOfCollapsedLogs",60,"i",0],["numOfCollapsedLogsWarning",64,"i",0],["numOfCollapsedLogsError",68,"i",0],["showClearOnNewSceneLoadedButton",72,"b",0],["showTimeButton",73,"b",0],["showSceneButton",74,"b",0],["showMemButton",75,"b",0],["showFpsButton",76,"b",0],["showSearchText",77,"b",0],["buildDate",80,"s",0],["logDate",84,"s",0],["logsMemUsage",88,"f",0],["graphMemUsage",92,"f",0],["gcTotalMemory",96,"f",0],["UserData",100,"s",0],["fps",104,"f",0],["fpsText",108,"s",0],["currentView",112,"t:ReportView",0],["created",0,"b",1],["images",116,"p:Images",0],["clearContent",120,"p:GUIContent",0],["collapseContent",124,"p:GUIContent",0],["clearOnNewSceneContent",128,"p:GUIContent",0],["showTimeContent",132,"p:GUIContent",0],["showSceneContent",136,"p:GUIContent",0],["userContent",140,"p:GUIContent",0],["showMemoryContent",144,"p:GUIContent",0],["softwareContent",148,"p:GUIContent",0],["dateContent",152,"p:GUIContent",0],["showFpsContent",156,"p:GUIContent",0],["infoContent",160,"p:GUIContent",0],["searchContent",164,"p:GUIContent",0],["closeContent",168,"p:GUIContent",0],["buildFromContent",172,"p:GUIContent",0],["systemInfoContent",176,"p:GUIContent",0],["graphicsInfoContent",180,"p:GUIContent",0],["backContent",184,"p:GUIContent",0],["logContent",188,"p:GUIContent",0],["warningContent",192,"p:GUIContent",0],["errorContent",196,"p:GUIContent",0],["barStyle",200,"p:GUIStyle",0],["buttonActiveStyle",204,"p:GUIStyle",0],["nonStyle",208,"p:GUIStyle",0],["lowerLeftFontStyle",212,"p:GUIStyle",0],["backStyle",216,"p:GUIStyle",0],["evenLogStyle",220,"p:GUIStyle",0],["oddLogStyle",224,"p:GUIStyle",0],["logButtonStyle",228,"p:GUIStyle",0],["selectedLogStyle",232,"p:GUIStyle",0],["selectedLogFontStyle",236,"p:GUIStyle",0],["stackLabelStyle",240,"p:GUIStyle",0],["scrollerStyle",244,"p:GUIStyle",0],["searchStyle",248,"p:GUIStyle",0],["sliderBackStyle",252,"p:GUIStyle",0],["sliderThumbStyle",256,"p:GUIStyle",0],["toolbarScrollerSkin",260,"p:GUISkin",0],["logScrollerSkin",264,"p:GUISkin",0],["graphScrollerSkin",268,"p:GUISkin",0],["size",272,"t:Vector2",0],["maxSize",280,"f",0],["numOfCircleToShow",284,"i",0],["scenes",4,"p",1],["currentScene",288,"s",0],["filterText",292,"s",0],["deviceModel",296,"s",0],["deviceType",300,"s",0],["deviceName",304,"s",0],["graphicsMemorySize",308,"s",0],["maxTextureSize",312,"s",0],["systemMemorySize",316,"s",0],["Initialized",320,"b",0],["screenRect",324,"t:Rect",0],["toolBarRect",340,"t:Rect",0],["logsRect",356,"t:Rect",0],["stackRect",372,"t:Rect",0],["graphRect",388,"t:Rect",0],["graphMinRect",404,"t:Rect",0],["graphMaxRect",420,"t:Rect",0],["buttomRect",436,"t:Rect",0],["stackRectTopLeft",452,"t:Vector2",0],["detailRect",460,"t:Rect",0],["scrollPosition",476,"t:Vector2",0],["scrollPosition2",484,"t:Vector2",0],["toolbarScrollPosition",492,"t:Vector2",0],["selectedLog",500,"p:Log",0],["toolbarOldDrag",504,"f",0],["oldDrag",508,"f",0],["oldDrag2",512,"f",0],["oldDrag3",516,"f",0],["startIndex",520,"i",0],["countRect",524,"t:Rect",0],["timeRect",540,"t:Rect",0],["timeLabelRect",556,"t:Rect",0],["sceneRect",572,"t:Rect",0],["sceneLabelRect",588,"t:Rect",0],["memoryRect",604,"t:Rect",0],["memoryLabelRect",620,"t:Rect",0],["fpsRect",636,"t:Rect",0],["fpsLabelRect",652,"t:Rect",0],["tempContent",668,"p:GUIContent",0],["infoScrollPosition",672,"t:Vector2",0],["oldInfoDrag",680,"t:Vector2",0],["tempRect",688,"t:Rect",0],["graphSize",704,"f",0],["startFrame",708,"i",0],["currentFrame",712,"i",0],["tempVector1",716,"t:Vector3",0],["tempVector2",728,"t:Vector3",0],["graphScrollerPos",740,"t:Vector2",0],["maxFpsValue",748,"f",0],["minFpsValue",752,"f",0],["maxMemoryValue",756,"f",0],["minMemoryValue",760,"f",0],["gestureDetector",764,"p",0],["gestureSum",768,"t:Vector2",0],["gestureLength",776,"f",0],["gestureCount",780,"i",0],["lastClickTime",784,"f",0],["startPos",788,"t:Vector2",0],["downPos",796,"t:Vector2",0],["mousePosition",804,"t:Vector2",0],["frames",812,"i",0],["firstTime",816,"b",0],["lastUpdate",820,"f",0],["requiredFrames",0,"i",1],["updateInterval",0,"f",1],["threadedLogs",824,"p",0]],"_LogType":[["value__",8,"i",0],["Assert",0,"t:_LogType",1],["Error",0,"t:_LogType",1],["Exception",0,"t:_LogType",1],["Log",0,"t:_LogType",1],["Warning",0,"t:_LogType",1]],"Sample":[["time",8,"f",0],["loadedScene",12,"b",0],["memory",16,"f",0],["fps",20,"f",0],["fpsText",24,"s",0]],"Log":[["count",8,"i",0],["logType",12,"t:_LogType",0],["condition",16,"s",0],["stacktrace",20,"s",0],["sampleId",24,"i",0]],"ReportView":[["value__",8,"i",0],["None",0,"t:ReportView",1],["Logs",0,"t:ReportView",1],["Info",0,"t:ReportView",1],["Snapshot",0,"t:ReportView",1]],"DetailView":[["value__",8,"i",0],["None",0,"t:DetailView",1],["StackTrace",0,"t:DetailView",1],["Graph",0,"t:DetailView",1]],"ReporterGUI":[["reporter",12,"p:Reporter",0]],"ReporterMessageReceiver":[["reporter",12,"p:Reporter",0]],"Rotate":[["angle",12,"t:Vector3",0]],"Rotation":[["speed",12,"t:Vector3",0]],"Score":[["score",8,"i",0],["user",12,"t:User",0]],"ScoreData":[["data",8,"p",0]],"ScriptableObj":[["obj",12,"p",0]],"ShopSkinsPrice":[["t",12,"p:Text",0],["s",16,"p:ShopSleds",0]],"ShopSleds":[["OnChangeItem",0,"p:UnityEvent",1],["skinData",12,"p:SkinData",0],["navigationBlock",16,"p:MenuBlock",0],["itemInfoBlock",20,"p:MenuBlock",0],["buyBlock",24,"p:MenuBlock",0],["ownedBlock",28,"p:MenuBlock",0],["buyObject",32,"p:GameObject",0],["comingSoonPrefab",36,"p:GameObject",0],["currentModelIndex",40,"i",0],["sledsModel",44,"p:GameObject",0],["inst",4,"p:ShopSleds",1]],"ShopSledTitle":[["t",12,"p:Text",0],["s",16,"p:ShopSleds",0]],"Skin":[["title",8,"s",0],["description",12,"s",0],["model",16,"p:GameObject",0],["physicsModel",20,"p:ScriptableObj",0],["price",24,"i",0]],"SkinData":[["skins",12,"p",0]],"SledBox":[["boxPrefab",12,"p:GameObject",0],["physicsBoxPrefab",16,"p:ScriptableObj",0],["box",20,"p:GameObject",0],["point",24,"p:Transform",0]],"SledgeData":[["baseMoveSpeed",12,"f",0],["speedAcceleration",16,"f",0],["speedAccelerationAmplitude",20,"f",0],["rotationSpeed",24,"f",0],["rotationSmoothness",28,"f",0],["modelRotationSmoothness",32,"f",0],["pointJumpDelay",36,"f",0],["jumpSpeed",40,"f",0]],"SledgePoint":[["startPosition",12,"t:Vector3",0],["upRay",24,"t:Ray",0],["downRay",48,"t:Ray",0],["hit",72,"t:RaycastHit",0],["vSpeed",116,"f",0],["gravityAcc",120,"f",0],["isGrounded",124,"b",0],["data",128,"p:SledgeData",0],["rayLength",132,"f",0],["mask",136,"t:LayerMask",0]],"SledgeSkinBuyButton":[["s",12,"p:ShopSleds",0]],"SledSkinControl":[["savePath",0,"s",1],["skins",4,"p",1]],"SledSkin":[["codeName",8,"s",0],["isOwned",12,"b",0]],"SledSkinSelector":[["skinData",12,"p:SkinData",0],["currModel",16,"p:GameObject",0],["skinParent",20,"p:Transform",0]],"Slowdown":[["onAwake",12,"b",0],["amount",16,"f",0],["duration",20,"f",0]],"SnowBall":[["rb",12,"p:Rigidbody",0],["force",16,"f",0],["direction",20,"f",0],["minSize",24,"f",0],["maxSize",28,"f",0]],"SnowBalls":[["spawner",12,"p:GameObject",0],["startChunk",16,"p:ScriptableObj",0],["endChunk",20,"p:ScriptableObj",0],["dir",24,"i",0]],"SnowBallSpawner":[["snowballBigPrefab",12,"p:GameObject",0],["interval",16,"f",0],["ratio",20,"i",0],["speed",24,"f",0],["randomness",28,"f",0],["dir",32,"i",0],["ballCount",36,"i",0]],"SnowParticleControl":[["startPos",12,"t:Vector3",0]],"SoundButton":[["indicatorImage",12,"p:Image",0],["onSprite",16,"p:Sprite",0],["offSprite",20,"p:Sprite",0]],"SoundControl":[["giftClip",12,"p:AudioClip",0],["increaseScoreClip",16,"p:AudioClip",0],["beatScoreClip",20,"p:AudioClip",0],["popupClip",24,"p:AudioClip",0],["sledLandClip",28,"p:AudioClip",0],["sledTurnClip",32,"p:AudioClip",0],["sledCrashClip",36,"p:AudioClip",0],["skiSource",40,"p:AudioSource",0],["rotateSource",44,"p:AudioSource",0],["windSource",48,"p:AudioSource",0],["musicSource",52,"p:AudioSource",0],["audioSource",56,"p:AudioSource",0],["instance",0,"p:SoundControl",1],["prevRot",60,"f",0]],"SpriteChange":[["interval",12,"f",0],["spr1",16,"p:Sprite",0],["spr2",20,"p:Sprite",0],["image1",24,"p:Image",0],["image2",28,"p:Image",0],["isFirst",32,"b",0]],"SpriteMirror":[["interval",12,"f",0],["t",16,"p:RectTransform",0]],"StructData":[["name",12,"s",0],["minScoreToSpawn",16,"i",0],["maxScoreToSpawn",20,"i",0],["probability",24,"f",0],["minLenght",28,"i",0],["maxLength",32,"i",0],["mod",36,"p:GenModifier",0],["midChunks",40,"p",0],["sideChunks",44,"p",0]],"Swing":[["maxAngle",12,"t:Vector3",0],["interval",24,"t:Vector3",0],["timeScaleEnabled",36,"b",0],["startRot",40,"t:Quaternion",0],["time",56,"f",0]],"TapToSlide":[["popup",12,"p:Popup",0]],"TestReporter":[["logTestCount",12,"i",0],["threadLogTestCount",16,"i",0],["logEverySecond",20,"b",0],["currentLogTestCount",24,"i",0],["reporter",28,"p:Reporter",0],["style",32,"p:GUIStyle",0],["rect1",36,"t:Rect",0],["rect2",52,"t:Rect",0],["rect3",68,"t:Rect",0],["rect4",84,"t:Rect",0],["rect5",100,"t:Rect",0],["rect6",116,"t:Rect",0],["thread",132,"p:Thread",0],["elapsed",136,"f",0]],"Text3D":[["data",12,"p:Text3DData",0],["text",16,"s",0],["scale",20,"f",0],["gapDistance",24,"f",0],["offset",28,"f",0],["letters",32,"p",0]],"Text3DData":[["letter",12,"p",0]],"TextOutline":[["pixelSize",12,"f",0],["outlineColor",16,"t:Color",0],["resolutionDependant",32,"b",0],["doubleResolution",36,"i",0],["textMesh",40,"p:TextMesh",0],["meshRenderer",44,"p:MeshRenderer",0]],"TextTransparency":[["frequency",12,"f",0],["amplitude",16,"f",0],["averageAlpha",20,"f",0],["text",24,"p:Text",0]],"TransitionControl":[["image",12,"p:Image",0],["blackScreenDuration",16,"f",0],["transitionTime",20,"f",0],["currentA",24,"f",0],["instance",0,"p:TransitionControl",1]],"Tunnel":[["tunnelPrefab",12,"p",0],["nextStruct",16,"p:StructData",0]],"TutorialControl":[["enable",12,"b",0]],"UIAlign":[["offset",12,"f",0],["updateAlign",16,"b",0],["alignText",20,"p:Text",0],["canvas",24,"p:Canvas",0]],"User":[["id",8,"i",0],["name",12,"s",0]],"WaitCanvasControl":[["timeText",12,"p:Text",0]],"WorldBender":[["extraCullHeight",12,"f",0],["hero",16,"p:GameObject",0],["_camera",20,"p:Camera",0],["attenuation",24,"f",0],["horizonOffset",28,"f",0],["spread",32,"f",0]],"DisableAfter":[["disableItAfter",12,"f",0]],"ServerManager":[["MaxTimeScale",12,"f",0],["Loader",16,"p:GameObject",0],["RewardLoader",20,"p:GameObject",0],["PlayCanvas",24,"p:GameObject",0],["TextInfo",28,"p:GameObject",0],["gameOverCounter",0,"i",1],["isLoaderEnabled",4,"b",1],["isRewardLoaderEnabled",5,"b",1],["DomainName",32,"s",0],["domainCheck",6,"b",1],["domainsList",8,"s",1],["blacklistDomainCheck",12,"b",1],["blacklistDomainsList",16,"s",1],["absoluteUrlCheck",20,"b",1],["absoluteUrlList",24,"s",1],["supportEmail",28,"s",1],["forceOneAduFreegames",32,"b",1],["allowCrossPromo",33,"b",1],["crossPromoTitle",36,"s",1],["crossPromoImageUrl",40,"s",1],["crossPromoLinkUrl",44,"s",1],["crossPromoAdsAfter",48,"f",1],["forceOpenCrossPromo",52,"b",1],["rewardAdsInterval",56,"f",1],["allowGBRecursive",60,"b",1],["preloadRewardAds",61,"b",1],["instance",64,"p:ServerManager",1],["CR_running",68,"b",1],["canShowLoader",69,"b",1],["firstAd",70,"b",1],["firstRewardAd",71,"b",1],["time",72,"f",1],["timeReward",76,"f",1],["StartRewardAfter",36,"f",0],["isInterstitialLoaderVisible",40,"b",0],["isRewardLoaderVisible",41,"b",0],["domainsList_y8",80,"s",1],["Y8_ID",84,"s",1],["enableAds_y8",88,"b",1],["startAdsAfter_y8",92,"f",1],["timeBetweenAds_y8",96,"f",1],["y8LoggedInCheck",100,"b",1],["Is_y8Domain",101,"b",1],["allowY8Recursive",102,"b",1],["isY8FirstAd",103,"b",1],["timeY8",104,"f",1],["isAutoLogChecked",108,"b",1],["enableIntVal",109,"b",1],["intVal",112,"i",1],["nonLoginOnly",116,"b",1],["allowLogs",117,"b",1],["RemoteChecked",118,"b",1],["isY8Ad",119,"b",1],["shouldPauseGame",42,"b",0]],"JSONBinaryTag":[["value__",8,"i",0],["Array",0,"t:JSONBinaryTag",1],["Class",0,"t:JSONBinaryTag",1],["Value",0,"t:JSONBinaryTag",1],["IntValue",0,"t:JSONBinaryTag",1],["DoubleValue",0,"t:JSONBinaryTag",1],["BoolValue",0,"t:JSONBinaryTag",1],["FloatValue",0,"t:JSONBinaryTag",1]],"JSONArray":[["m_List",8,"p",0]],"JSONClass":[["m_Dict",8,"p",0]],"JSONData":[["m_Data",8,"s",0]],"JSONLazyCreator":[["m_Node",8,"p:JSONNode",0],["m_Key",12,"s",0]],"CrossPromoController":[["KEY_ENABLED",0,"s",1],["KEY_IOS",0,"s",1],["KEY_ANDROID",0,"s",1],["KEY_APP_PREFIX",0,"s",1],["KEY_APP_TITLE",0,"s",1],["KEY_IMAGE_URL",0,"s",1],["KEY_ID",0,"s",1],["KEY_FRAME_COLOR",0,"s",1],["KEY_NEW_TEXT_COLOR",0,"s",1],["KEY_PLAY_BTN_COLOR",0,"s",1],["KEY_TEXT_BTN_COLOR",0,"s",1],["DescriptorUrl",12,"s",0],["LogOn",16,"b",0],["PromoWindow",20,"p:GameObject",0],["PlayBtn",24,"p:Button",0],["OkBtn",28,"p:Button",0],["PromoImage",32,"p:Image",0],["FrameImage",36,"p:Image",0],["NewTextImage",40,"p:Image",0],["PlayBtnText",44,"p:Image",0],["CrossPromoDummyJson",48,"p:TextAsset",0],["instance",0,"p:CrossPromoController",1],["AdShown",4,"b",1]],"CoroutineWithData":[["result",12,"p",0],["target",16,"p:IEnumerator",0]],"EasingType":[["value__",8,"i",0],["Step",0,"t:EasingType",1],["Linear",0,"t:EasingType",1],["Sine",0,"t:EasingType",1],["Quadratic",0,"t:EasingType",1],["Cubic",0,"t:EasingType",1],["Quartic",0,"t:EasingType",1],["Quintic",0,"t:EasingType",1]],"Noise":[["grad3",0,"p",1],["p",4,"p",1],["perm",8,"p",1]],"LoadAllLanguages":[["currentLanguageKeys",12,"p",0],["availableLanguages",16,"p",0],["languageManager",20,"p:LanguageManager",0],["valuesScrollPosition",24,"t:Vector2",0],["languagesScrollPosition",32,"t:Vector2",0]]};

  //==CORE-BEGIN==
  function makeCore(FIELDS) {
    const M = () => gameInstance.Module;
    const I = () => M().HEAP32, U = () => M().HEAPU8;
    const DV = () => new DataView(M().HEAPU8.buffer);

    // ---- IL2CPP metadata (lives in the heap) -> find classes by name ----
    let meta;
    const findMeta = () => {
      if (meta) return meta;
      const u8 = U(), dv = new DataView(u8.buffer);
      for (let i = u8.indexOf(0xAF); i !== -1; i = u8.indexOf(0xAF, i + 1)) {
        if (u8[i + 1] !== 0x1B || u8[i + 2] !== 0xB1 || u8[i + 3] !== 0xFA || dv.getInt32(i + 4, true) !== 24) continue;
        const off = (k) => dv.getInt32(i + 8 + 8 * k, true), sz = (k) => dv.getInt32(i + 12 + 8 * k, true);
        return (meta = { base: i, str: off(2), td: off(19), tdN: sz(19) / 100, dv, u8 });
      }
      throw new Error("metadata not found in memory");
    };
    const cstr = (a) => { const u8 = U(); let s = ""; while (u8[a]) s += String.fromCharCode(u8[a++]); return s; };
    const typedef = (name) => {
      const m = findMeta();
      for (let t = 0; t < m.tdN; t++) {
        const at = m.base + m.td + t * 100;
        const ni = m.dv.getInt32(at, true), si = m.dv.getInt32(at + 4, true);
        if (m.u8[m.base + m.str + si] !== 0) continue; // global namespace only
        if (cstr(m.base + m.str + ni) === name) return { nameAddr: m.base + m.str + ni, tdAddr: at };
      }
      throw new Error("no class named " + name);
    };
    const kc = {};
    const klass = (name) => {
      if (kc[name]) return kc[name];
      const td = typedef(name), h = I();
      for (let w = 0; w < h.length; w++) {
        if (h[w] !== td.nameAddr) continue;
        const k = w * 4 - 8;
        if (k < 0) continue;
        for (let j = 0; j < 40; j++) if (h[k / 4 + j] === td.tdAddr) return (kc[name] = k);
      }
      throw new Error(name + " is not loaded yet (start a run first)");
    };

    const okPtr = (p) => p >= 0x400 && p < U().length && (p & 3) === 0;
    const statics = (cls) => { const p = I()[(klass(cls) + 92) / 4]; return okPtr(p) ? p : 0; };

    // ---- typed read / write ----
    const str = (p) => {
      if (!okPtr(p)) return null;
      const v = DV(), n = v.getInt32(p + 8, true);
      if (n < 0 || n > 4000) return null;
      let s = "";
      for (let i = 0; i < Math.min(n, 200); i++) s += String.fromCharCode(v.getUint16(p + 12 + 2 * i, true));
      return s;
    };
    const rd = (code, a) => {
      const v = DV();
      switch (code[0]) {
        case "f": return v.getFloat32(a, true);
        case "d": return v.getFloat64(a, true);
        case "b": return v.getUint8(a) !== 0;
        case "h": return v.getInt16(a, true);
        case "i": return v.getInt32(a, true);
        case "l": return v.getInt32(a, true) + v.getInt32(a + 4, true) * 4294967296;
        case "p": return v.getUint32(a, true);
        case "s": return str(v.getUint32(a, true));
      }
      return undefined;
    };
    const wr = (code, a, x) => {
      const v = DV();
      switch (code[0]) {
        case "f": v.setFloat32(a, +x, true); break;
        case "d": v.setFloat64(a, +x, true); break;
        case "b": v.setUint8(a, x ? 1 : 0); break;
        case "h": v.setInt16(a, x, true); break;
        case "i": v.setInt32(a, x, true); break;
        case "l": v.setInt32(a, x % 4294967296, true); v.setInt32(a + 4, Math.floor(x / 4294967296), true); break;
        case "p": v.setUint32(a, x >>> 0, true); break;
      }
    };
    const fdef = (cls, name) => {
      const f = (FIELDS[cls] || []).find((r) => r[0] === name);
      if (!f) throw new Error("unknown field " + cls + "." + name);
      return f;
    };

    // ---- instances ----
    const valid = (cls, a) => {
      const h = I(), m = h[(a >> 2) + 1] >>> 0;
      if (m !== 0 && !okPtr(m)) return false;
      const len = U().length;
      for (const f of FIELDS[cls] || []) {
        if (f[3]) continue;
        const c = f[2][0], at = a + f[1];
        if (at + 4 > len) return false;
        if (c === "p" || c === "s") { const pv = DV().getUint32(at, true); if (pv !== 0 && !okPtr(pv)) return false; }
        else if (c === "b") { if (U()[at] > 1) return false; }
        else if (c === "f") { const x = DV().getFloat32(at, true); if (!isFinite(x) || Math.abs(x) > 1e12) return false; }
      }
      return true;
    };
    const find = (cls) => {
      const k = klass(cls), h = I(), out = [];
      for (let w = 0; w < h.length; w++) {
        if (h[w] !== k) continue;
        const a = w * 4;
        if (a >= k && a < k + 400) continue;
        if (valid(cls, a)) out.push(a);
      }
      return out;
    };
    // same scan, but in slices so the game keeps running
    const findAsync = (cls, done, progress) => {
      let k;
      try { k = klass(cls); } catch (e) { return done([], e); }
      const out = []; let w = 0;
      const step = () => {
        const h = I(), n = h.length, end = Math.min(n, w + 3000000);
        for (; w < end; w++) {
          if (h[w] !== k) continue;
          const a = w * 4;
          if (a >= k && a < k + 400) continue;
          if (valid(cls, a)) out.push(a);
        }
        if (progress) progress(w / n);
        if (w < n) setTimeout(step, 0); else done(out);
      };
      step();
    };
    const obj = (cls) => {
      const f = (FIELDS[cls] || []).find((r) => r[3] && /^(instance|inst|Instance)$/.test(r[0]) && r[2][0] === "p");
      const s = statics(cls);
      if (!f || !s) return 0;
      const p = rd("p", s + f[1]);
      return okPtr(p) ? p : 0;
    };

    const get = (cls, a, n) => { const f = fdef(cls, n); return rd(f[2], a + f[1]); };
    const set = (cls, a, n, x) => { const f = fdef(cls, n); wr(f[2], a + f[1], x); return rd(f[2], a + f[1]); };
    const sget = (cls, n) => { const f = fdef(cls, n); return rd(f[2], statics(cls) + f[1]); };
    const sset = (cls, n, x) => { const f = fdef(cls, n); wr(f[2], statics(cls) + f[1], x); return rd(f[2], statics(cls) + f[1]); };
    const rows = (cls, a) => {
      const s = statics(cls), out = [];
      for (const f of FIELDS[cls] || []) {
        const base = f[3] ? s : a;
        let value = null;
        try { value = base ? rd(f[2], base + f[1]) : null; } catch (e) {}
        out.push({ name: f[0], off: f[1], type: f[2], stat: !!f[3], value, base });
      }
      return out;
    };

    // ---- remember originals so x1 / Reset restores them ----
    const orig = new Map();
    const tune = (cls, a, mults) => {
      let o = orig.get(a);
      if (!o) { o = {}; for (const n in mults) o[n] = get(cls, a, n); orig.set(a, o); }
      for (const n in mults) if (isFinite(o[n])) set(cls, a, n, o[n] * mults[n]);
    };
    const stash = (cls, a, n) => {
      const key = a + ":" + n;
      if (!orig.has(key)) orig.set(key, get(cls, a, n));
      return orig.get(key);
    };
    const unstash = (cls, a, n) => { const key = a + ":" + n; if (orig.has(key)) set(cls, a, n, orig.get(key)); };

    // ---- saved "Gifts" total: entry in the in-memory prefs table (12-byte key, then the value) ----
    const GIFT_ADDR = 0x169B594;
    const isKey = (u8, a) => u8[a] === 71 && u8[a + 1] === 105 && u8[a + 2] === 102 && u8[a + 3] === 116 && u8[a + 4] === 115 && u8[a + 5] === 0;
    const hasText = (u8, a, t) => { for (let i = 0; i < t.length; i++) if (u8[a + i] !== t.charCodeAt(i)) return false; return true; };
    let giftAt = 0;
    const giftSlot = () => {
      const u8 = U();
      if (giftAt && isKey(u8, giftAt - 12)) return giftAt;
      if (isKey(u8, GIFT_ADDR)) return (giftAt = GIFT_ADDR + 12);
      const n = Math.min(u8.length - 32, 0x6000000);
      for (let a = 0; a < n; a += 4) {
        if (u8[a] !== 71 || !isKey(u8, a)) continue;
        let z = true;
        for (let i = 6; i < 12; i++) if (u8[a + i] !== 0) { z = false; break; }
        if (!z) continue;
        for (let b = a - 0x200; b < a; b++) if (b > 0 && hasText(u8, b, "FixTime")) return (giftAt = a + 12);
      }
      return 0;
    };

    return { M, I, U, klass, statics, obj, find, findAsync, get, set, sget, sset, rows, tune, stash, unstash, str, okPtr, giftSlot, FIELDS, rd, wr };
  }
  //==CORE-END==

  const core = makeCore(FIELDS);
  window.snow = core;

  // ================= wait for the game, then build the menu =================
  const wait = setInterval(function () {
    try {
      if (typeof gameInstance === "undefined" || !gameInstance.Module || !gameInstance.Module.HEAP32) return;
    } catch (e) { return; }
    clearInterval(wait);
    start();
  }, 400);

  function start() {
    if (window.__srMenu) return;
    window.__srMenu = true;

    // ================= saved settings =================
    const KEY = "srmenu_v1";
    const loadSaved = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
    const saved = loadSaved();
    const S = (window.__SR = { tab: 0, spd: 1, jmp: 1, auto: false, sb: {}, gift: {}, inv: false });
    ["tab", "spd", "jmp", "auto", "sb", "gift", "inv"].forEach((k) => { if (saved[k] !== undefined) S[k] = saved[k]; });

    const setStatus = (t) => { status.textContent = t; };
    const guard = (fn) => (...a) => { try { return fn(...a); } catch (e) { setStatus(String(e.message || e)); } };
    const hex = (n) => "0x" + (n >>> 0).toString(16).toUpperCase();

    // ================= UI =================
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;top:50px;left:12px;z-index:2147483647;";
    ["mousedown","mouseup","mousemove","click","dblclick","touchstart","touchmove","touchend","touchcancel",
     "pointerdown","pointermove","pointerup","pointercancel","wheel","contextmenu","keydown","keyup","keypress","input","change"]
      .forEach((ev) => host.addEventListener(ev, (e) => e.stopPropagation()));
    const root = host.attachShadow({ mode: "open" });

    const spring = "cubic-bezier(.34,1.56,.64,1)";
    const soft = "cubic-bezier(.22,1,.36,1)";
    const MONO = "ui-monospace,Menlo,Consolas,monospace";
    const css = [
      ".p{position:relative;width:340px;color:#000;font:13px -apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif;border-radius:34px;",
      "background:linear-gradient(135deg,rgba(255,255,255,.16),rgba(255,255,255,.04));",
      "-webkit-backdrop-filter:blur(14px) saturate(190%) brightness(1.08);",
      "backdrop-filter:blur(14px) saturate(190%) brightness(1.08);",
      "backdrop-filter:url(#lgfilter) blur(6px) saturate(190%) brightness(1.08);",
      "box-shadow:0 18px 50px rgba(0,0,0,.35),0 2px 8px rgba(0,0,0,.2),inset 0 0 0 1px rgba(255,255,255,.1),inset 0 1px 1px rgba(255,255,255,.55),inset 0 -10px 22px rgba(255,255,255,.07);",
      "transition:transform .7s " + soft + ";user-select:none;overflow:hidden;will-change:transform}",
      ".p::before{content:'';position:absolute;inset:0;border-radius:inherit;padding:1.5px;pointer-events:none;z-index:3;",
      "background:linear-gradient(140deg,rgba(255,255,255,.95),rgba(255,255,255,.08) 28%,rgba(255,255,255,.04) 62%,rgba(255,255,255,.7));",
      "-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}",
      ".p::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:0;",
      "background:radial-gradient(230px circle at var(--mx,30%) var(--my,0%),rgba(255,255,255,.26),rgba(255,255,255,0) 62%)}",
      ".h,.b{position:relative;z-index:1}",
      ".h{padding:15px 18px 9px;display:flex;justify-content:space-between;align-items:center;cursor:grab;touch-action:none;font-weight:700;font-size:15px;letter-spacing:.2px;text-shadow:0 1px 6px rgba(255,255,255,.55)}",
      ".dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:#34c759;margin-left:8px;opacity:0;transition:opacity .6s;vertical-align:middle;box-shadow:0 0 8px #34c759}",
      ".dot.on{opacity:1;transition:none}",
      ".min{width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:linear-gradient(160deg,rgba(255,255,255,.35),rgba(255,255,255,.1));box-shadow:inset 0 1px 1px rgba(255,255,255,.6);color:#000;font-size:15px;line-height:24px;text-align:center;cursor:pointer;padding:0;transition:transform .35s " + soft + "}",
      ".b{padding:2px 14px 16px;display:flex;flex-direction:column;gap:10px;max-height:calc(100vh - 110px);overflow-y:auto}",
      ".b::-webkit-scrollbar{width:6px}.b::-webkit-scrollbar-thumb{background:rgba(255,255,255,.3);border-radius:3px}",
      ".b.hide{display:none}",
      ".tabs{position:relative;display:flex;padding:3px;border-radius:18px;background:rgba(0,0,0,.22);box-shadow:inset 0 1px 3px rgba(0,0,0,.25),0 1px 0 rgba(255,255,255,.2)}",
      ".tab{flex:1;text-align:center;padding:8px 0;font-weight:600;font-size:12px;cursor:pointer;position:relative;z-index:1;opacity:.7;transition:opacity .3s,transform .35s " + soft + "}",
      ".tab.on{opacity:1}",
      ".tab:active{transform:scale(.95)}",
      ".ind{position:absolute;top:3px;bottom:3px;left:3px;width:calc((100% - 6px) / 3);border-radius:15px;background:linear-gradient(160deg,rgba(255,255,255,.42),rgba(255,255,255,.14));box-shadow:inset 0 1px 1px rgba(255,255,255,.7),0 2px 8px rgba(0,0,0,.2);transition:transform .6s " + soft + "}",
      ".tabs.t1 .ind{transform:translateX(100%)}",
      ".tabs.t2 .ind{transform:translateX(200%)}",
      ".pg{display:flex;flex-direction:column;gap:10px;animation:pgin .5s " + soft + "}",
      ".pg.hide{display:none}",
      "@keyframes pgin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
      ".card{background:linear-gradient(160deg,rgba(255,255,255,.2),rgba(255,255,255,.06));border-radius:24px;padding:11px 13px;box-shadow:inset 0 1px 1px rgba(255,255,255,.5),inset 0 0 0 1px rgba(255,255,255,.12),0 4px 14px rgba(0,0,0,.12)}",
      ".card .row+.row{margin-top:9px}",
      ".row{display:flex;align-items:center;justify-content:space-between;gap:10px}",
      ".lbl{font-weight:600}",
      ".lbl small{display:block;opacity:.7;font-size:11px;font-weight:400;margin-top:1px}",
      ".step{display:flex;align-items:center;gap:2px;background:rgba(0,0,0,.22);border-radius:16px;padding:3px;box-shadow:inset 0 1px 3px rgba(0,0,0,.25),0 1px 0 rgba(255,255,255,.2)}",
      ".step button{width:28px;height:28px;border:0;border-radius:13px;background:linear-gradient(160deg,rgba(255,255,255,.34),rgba(255,255,255,.12));box-shadow:inset 0 1px 1px rgba(255,255,255,.6);color:#000;font-size:17px;line-height:26px;cursor:pointer;padding:0;transition:transform .35s " + soft + "}",
      ".step input{width:44px;text-align:center;background:transparent;border:0;color:#000;font:700 14px -apple-system,system-ui,sans-serif;outline:none;-moz-appearance:textfield;padding:0}",
      ".step.wide input{width:64px}",
      ".step input::-webkit-inner-spin-button,.step input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}",
      "input,select{user-select:text;-webkit-user-select:text}",
      ".min:active,.step button:active{transform:scale(.85)}",
      ".sw{width:50px;height:30px;border-radius:15px;background:rgba(255,255,255,.2);box-shadow:inset 0 1px 3px rgba(0,0,0,.28),0 1px 0 rgba(255,255,255,.25);position:relative;cursor:pointer;transition:background .3s;flex:none}",
      ".sw i{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:12px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.4),inset 0 -2px 3px rgba(0,0,0,.08);transition:transform .5s " + soft + ",width .3s " + soft + ",background .2s}",
      ".sw.on{background:rgba(52,199,89,.9)}",
      ".sw.on i{transform:translateX(20px)}",
      ".sw:active i{width:32px;background:rgba(255,255,255,.8)}",
      ".sw.on:active i{transform:translateX(12px)}",
      ".btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:9px}",
      ".rbtn{border:0;border-radius:16px;padding:0 13px;height:30px;background:linear-gradient(160deg,rgba(255,255,255,.34),rgba(255,255,255,.12));box-shadow:inset 0 1px 1px rgba(255,255,255,.6);color:#000;font:600 12px -apple-system,system-ui,sans-serif;cursor:pointer;flex:none;transition:transform .35s " + soft + "}",
      ".rbtn:active{transform:scale(.92)}",
      ".seg{display:flex;padding:3px;border-radius:16px;background:rgba(0,0,0,.22);box-shadow:inset 0 1px 3px rgba(0,0,0,.25)}",
      ".seg div{padding:6px 12px;border-radius:13px;cursor:pointer;font-weight:600;font-size:12px;opacity:.7;transition:background .3s,opacity .3s}",
      ".seg div.on{opacity:1;background:linear-gradient(160deg,rgba(255,255,255,.4),rgba(255,255,255,.14));box-shadow:inset 0 1px 1px rgba(255,255,255,.7)}",
      ".sel{width:100%;box-sizing:border-box;height:32px;background:rgba(0,0,0,.28);border:0;border-radius:14px;color:#000;padding:0 10px;font:12.5px -apple-system,system-ui,sans-serif;outline:none;box-shadow:inset 0 1px 3px rgba(0,0,0,.25),0 1px 0 rgba(255,255,255,.2)}",
      ".sel option{color:#000}",
      ".status{font:11px " + MONO + ";opacity:.85;min-height:13px;padding:0 6px;text-shadow:0 1px 4px rgba(255,255,255,.55);word-break:break-word}",
      ".tbl{position:relative;max-height:250px;overflow-y:auto;border-radius:20px;background:rgba(0,0,0,.2);box-shadow:inset 0 1px 3px rgba(0,0,0,.28),0 1px 0 rgba(255,255,255,.2);margin-top:9px}",
      ".tbl::-webkit-scrollbar{width:6px}.tbl::-webkit-scrollbar-thumb{background:rgba(255,255,255,.3);border-radius:3px}",
      ".tr{min-height:30px;box-sizing:border-box;display:flex;align-items:center;gap:8px;padding:3px 10px;border-bottom:1px solid rgba(255,255,255,.07)}",
      ".nm{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:11px " + MONO + "}",
      ".nm i{font-style:normal;color:#000;opacity:.6;margin-left:6px;font-family:-apple-system,system-ui,sans-serif;font-size:10.5px}",
      ".tr input{width:104px;flex:none;box-sizing:border-box;background:rgba(255,255,255,.12);border:0;border-radius:9px;padding:4px 8px;color:#000;font:600 11.5px " + MONO + ";outline:none;text-align:right;box-shadow:inset 0 1px 2px rgba(0,0,0,.25)}",
      ".tr input:focus{background:rgba(255,255,255,.26)}",
      ".tr input[readonly]{opacity:.6}",
      ".go{border:0;background:rgba(255,255,255,.2);color:#000;border-radius:9px;width:24px;height:22px;cursor:pointer;padding:0;flex:none}",
      ".empty{padding:18px;text-align:center;opacity:.6;font-size:12px}"
    ].join("");

    // ---- typing that still works inside the game (Unity blocks keys + steals focus) ----
    let outside = false;
    document.addEventListener("pointerdown", (e) => { outside = e.composedPath().indexOf(host) < 0; }, true);
    const wireInput = (inp) => {
      let startVal = "";
      const fire = () => { if (inp.value !== startVal) { startVal = inp.value; inp.dispatchEvent(new Event("change", { bubbles: true })); } };
      const edit = (a, b, t) => { inp.setRangeText(t, a, b, "end"); inp.dispatchEvent(new Event("input", { bubbles: true })); };
      inp.addEventListener("focus", () => { startVal = inp.value; inp._leave = false; outside = false; });
      inp.addEventListener("pointerdown", () => setTimeout(() => inp.focus(), 0));
      inp.addEventListener("blur", () => {
        fire();
        if (!inp._leave && !outside && !inp.readOnly) setTimeout(() => { if (!root.activeElement) inp.focus(); }, 0);
      });
      inp.addEventListener("keydown", (e) => {
        if (inp.readOnly) return;
        const k = e.key;
        if (e.ctrlKey || e.metaKey) { if (k.toLowerCase() === "a") { e.preventDefault(); inp.select(); } return; }
        const s = inp.selectionStart, t = inp.selectionEnd, n = inp.value.length;
        if (k === "Enter" || k === "Escape") { e.preventDefault(); inp._leave = true; fire(); inp.blur(); }
        else if (k.length === 1) { e.preventDefault(); edit(s, t, k); }
        else if (k === "Backspace") { e.preventDefault(); if (s !== t) edit(s, t, ""); else if (s > 0) edit(s - 1, s, ""); }
        else if (k === "Delete") { e.preventDefault(); if (s !== t) edit(s, t, ""); else if (s < n) edit(s, s + 1, ""); }
        else if (k === "ArrowLeft") { e.preventDefault(); const q = s !== t ? s : Math.max(0, s - 1); inp.setSelectionRange(q, q); }
        else if (k === "ArrowRight") { e.preventDefault(); const q = s !== t ? t : Math.min(n, t + 1); inp.setSelectionRange(q, q); }
        else if (k === "Home") { e.preventDefault(); inp.setSelectionRange(0, 0); }
        else if (k === "End") { e.preventDefault(); inp.setSelectionRange(n, n); }
      });
    };
    const el = (tag, props, kids) => {
      const n = document.createElement(tag);
      if (props) Object.assign(n, props);
      if (tag === "input") wireInput(n);
      (kids || []).forEach((k) => n.appendChild(k));
      return n;
    };
    const text = (s) => document.createTextNode(s);

    // ---- refraction filter (bends the background at the glass edges) ----
    const svgs = [];
    const mkSvg = () => {
      const d = document.createElement("div");
      d.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;width:0;height:0;pointer-events:none">' +
        '<defs><filter id="lgfilter" filterUnits="userSpaceOnUse" x="0" y="0" width="300" height="400" color-interpolation-filters="sRGB">' +
        '<feImage x="0" y="0" width="300" height="400" preserveAspectRatio="none" result="map"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="map" scale="36" xChannelSelector="R" yChannelSelector="G"/>' +
        '</filter></defs></svg>';
      const s = d.firstChild; svgs.push(s); return s;
    };
    const makeMap = (w, h, r, bezel) => {
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const ctx = c.getContext("2d"), img = ctx.createImageData(w, h), d = img.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const px = x + 0.5 - w / 2, py = y + 0.5 - h / 2;
          const qx = Math.abs(px) - (w / 2 - r), qy = Math.abs(py) - (h / 2 - r);
          const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
          const inside = Math.min(Math.max(qx, qy), 0);
          const dist = -(outside + inside - r);
          let dx = 0, dy = 0;
          if (dist >= 0 && dist < bezel) {
            const t = 1 - dist / bezel, mag = t * t;
            let nx, ny;
            if (qx > 0 && qy > 0) { const l = Math.hypot(qx, qy); nx = Math.sign(px) * qx / l; ny = Math.sign(py) * qy / l; }
            else if (qx > qy) { nx = Math.sign(px); ny = 0; }
            else { nx = 0; ny = Math.sign(py); }
            dx = -nx * mag; dy = -ny * mag;
          }
          const i = (y * w + x) * 4;
          d[i] = 128 + dx * 127; d[i + 1] = 128 + dy * 127; d[i + 2] = 128; d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      return c.toDataURL();
    };

    const minBtn = el("button", { className: "min", textContent: "–" });
    const dot = el("span", { className: "dot" });
    const head = el("div", { className: "h" }, [el("span", { textContent: "Snow Rider" }, [dot]), minBtn]);
    const status = el("div", { className: "status", textContent: "ready - start a run for the game objects to exist" });

    // ---- number stepper (ints or decimals) ----
    const stepper = (init, min, max, wide, onSet, step, dec) => {
      step = step || 1; dec = dec || 0;
      const input = el("input", { type: "text", inputMode: "decimal", value: init });
      const minus = el("button", { textContent: "−" });
      const plus = el("button", { textContent: "+" });
      const wrap = el("div", { className: "step" + (wide ? " wide" : "") }, [minus, input, plus]);
      const norm = (v) => { v = +v; if (!isFinite(v)) v = min; v = Math.round(v / step) * step; v = Math.min(max, Math.max(min, v)); return +v.toFixed(dec); };
      const set = (v, user) => { v = norm(v); input.value = v; onSet(v, user); };
      input.onchange = () => set(input.value, true);
      minus.onclick = () => set(+input.value - step, true);
      plus.onclick = () => set(+input.value + step, true);
      // sync from the game without firing onSet, and never while you're typing
      const sync = (v) => { if (root.activeElement === input || v === undefined || v === null || !isFinite(v)) return; const n = +(+v).toFixed(dec); if (String(n) !== input.value) input.value = n; };
      return { wrap, input, set, sync };
    };
    const rowOf = (title, sub, ctl) => el("div", { className: "row" }, [
      el("div", { className: "lbl" }, [text(title), el("small", { textContent: sub })]), ctl]);
    const subOf = (r) => r.querySelector("small");
    const btn = (label, fn) => { const b = el("button", { className: "rbtn", textContent: label }); b.onclick = guard(fn); return b; };

    // =========================================================
    // TAB 1: GAME
    // =========================================================
    const speed = stepper(S.spd, 1, 50, false, (v, user) => { S.spd = v; if (user) setStatus("speed x" + v); });
    const jump = stepper(S.jmp, 1, 20, false, (v, user) => { S.jmp = v; if (user) setStatus("jump x" + v); });
    const run = stepper(0, 0, 9999999, true, guard((v, user) => { if (user) { core.sset("GameControl", "giftsThisGame", v); setStatus("presents this run = " + v); } }));
    const total = stepper(0, -99999, 99999999, true, guard((v, user) => {
      if (!user) return;
      const a = core.giftSlot();
      if (!a) return setStatus("saved presents entry not found");
      core.wr("i", a, v); setStatus("total presents = " + v + " (play a run to save)");
    }));
    const score = stepper(0, 0, 99999999, true, guard((v, user) => { if (user) { core.sset("GameControl", "score", v); setStatus("score = " + v); } }));

    const invSw = el("div", { className: "sw" + (S.inv ? " on" : "") }, [el("i")]);
    invSw.onclick = () => { S.inv = !S.inv; invSw.classList.toggle("on", S.inv); setStatus("invincible " + (S.inv ? "ON" : "OFF")); };
    const runCard = el("div", { className: "card" }, [rowOf("Presents this run", "added to your total at the end", run.wrap)]);
    runCard.appendChild(el("div", { className: "btns" }, [
      btn("+100", () => { const v = core.sget("GameControl", "giftsThisGame") + 100; core.sset("GameControl", "giftsThisGame", v); run.input.value = v; setStatus("presents this run = " + v); }),
      btn("+1000", () => { const v = core.sget("GameControl", "giftsThisGame") + 1000; core.sset("GameControl", "giftsThisGame", v); run.input.value = v; setStatus("presents this run = " + v); }),
      btn("+10000", () => { const v = core.sget("GameControl", "giftsThisGame") + 10000; core.sset("GameControl", "giftsThisGame", v); run.input.value = v; setStatus("presents this run = " + v); })
    ]));
    const sledsCard = el("div", { className: "card" }, [rowOf("Sleds", "unlock for this session / make free", el("div"))]);
    sledsCard.appendChild(el("div", { className: "btns" }, [
      btn("Free sleds", () => core.findAsync("Skin", guard((list, err) => {
        if (err) return setStatus(err.message);
        list.forEach((a) => core.set("Skin", a, "price", 0));
        setStatus("price = 0 on " + list.length + " sleds");
      }), (p) => setStatus("scanning " + Math.round(p * 100) + "%")))
    ]));
    const page0 = el("div", { className: "pg" }, [
      el("div", { className: "card" }, [rowOf("Invincible", "blocks crashes", invSw), rowOf("Speed", "base speed + acceleration", speed.wrap), rowOf("Jump power", "jump speed", jump.wrap)]),
      runCard,
      el("div", { className: "card" }, [rowOf("Total presents", "saved total", total.wrap), rowOf("Score", "current run", score.wrap)]),
      sledsCard
    ]);

    // =========================================================
    // TAB 2: SPAWNS
    // =========================================================
    const SB = [
      ["ballCount", "Balls per wave", 0, 500, 1, 0],
      ["interval", "Interval (s)", 0.05, 100, 0.05, 2],
      ["randomness", "Spread", 0, 100, 0.5, 1],
      ["speed", "Roll speed", 0, 300, 0.5, 1],
      ["ratio", "Ratio", 0, 100, 1, 0]
    ];
    const sbCtl = {};
    let spawners = [], sbTimer = 0, autoTimer = 0;
    const applySB = guard(() => {
      let n = 0;
      spawners.forEach((a) => {
        SB.forEach(([f]) => { if (S.sb[f] !== undefined) { core.stash("SnowBallSpawner", a, f); core.set("SnowBallSpawner", a, f, S.sb[f]); } });
        if (S.sb.dir !== undefined) { core.stash("SnowBallSpawner", a, "dir"); core.set("SnowBallSpawner", a, "dir", S.sb.dir); }
        n++;
      });
      setStatus("applied to " + n + " spawner(s)");
    });
    const scheduleSB = () => { clearTimeout(sbTimer); sbTimer = setTimeout(applySB, 350); };
    const rescanSB = (then) => core.findAsync("SnowBallSpawner", guard((list, err) => {
      if (err) return setStatus(err.message);
      spawners = list;
      subOf(sbHead).textContent = "found " + list.length;
      if (list.length) SB.forEach(([f]) => { if (S.sb[f] === undefined) sbCtl[f].sync(core.get("SnowBallSpawner", list[0], f)); });
      if (then) then(); else setStatus("found " + list.length + " snowball spawner(s)");
    }), (p) => setStatus("scanning " + Math.round(p * 100) + "%"));

    const sbHead = rowOf("Snowball spawners", "found 0", el("div"));
    const sbCard = el("div", { className: "card" }, [sbHead]);
    SB.forEach(([f, title, min, max, step, dec]) => {
      sbCtl[f] = stepper(S.sb[f] !== undefined ? S.sb[f] : min, min, max, false, (v, user) => { if (user) { S.sb[f] = v; scheduleSB(); } }, step, dec);
      sbCard.appendChild(rowOf(title, f, sbCtl[f].wrap));
    });
    const dirSeg = el("div", { className: "seg" });
    [["Left", -1], ["Right", 1]].forEach(([label, v]) => {
      const d = el("div", { textContent: label });
      d.onclick = () => { S.sb.dir = v; [...dirSeg.children].forEach((c) => c.classList.toggle("on", c === d)); scheduleSB(); };
      if (S.sb.dir === v) d.classList.add("on");
      dirSeg.appendChild(d);
    });
    sbCard.appendChild(rowOf("Direction", "dir (experimental)", dirSeg));
    const autoSw = el("div", { className: "sw" }, [el("i")]);
    const autoLoop = () => {
      clearTimeout(autoTimer);
      if (!S.auto) return;
      rescanSB(() => { applySB(); autoTimer = setTimeout(autoLoop, 2500); });
    };
    autoSw.onclick = () => { S.auto = !S.auto; autoSw.classList.toggle("on", S.auto); setStatus(S.auto ? "auto-apply on (rescans every few seconds)" : "auto-apply off"); autoLoop(); };
    if (S.auto) autoSw.classList.add("on");
    sbCard.appendChild(rowOf("Auto-apply", "also change new spawners", autoSw));
    sbCard.appendChild(el("div", { className: "btns" }, [
      btn("Rescan", () => rescanSB()),
      btn("Apply", () => rescanSB(applySB)),
      btn("Reset", () => {
        spawners.forEach((a) => { SB.forEach(([f]) => core.unstash("SnowBallSpawner", a, f)); core.unstash("SnowBallSpawner", a, "dir"); });
        S.sb = {}; setStatus("reset " + spawners.length + " spawner(s)");
      })
    ]));

    // level generator (static singleton, no scan needed)
    const giftCtl = stepper(S.gift.giftChunk !== undefined ? S.gift.giftChunk : 0, 0, 1000, false, guard((v, user) => {
      if (!user) return; S.gift.giftChunk = v; const g = core.obj("GGen"); if (!g) return setStatus("level generator not running yet");
      core.set("GGen", g, "giftChunk", v); setStatus("giftChunk = " + v);
    }));
    const distCtl = stepper(S.gift.generateDistance !== undefined ? S.gift.generateDistance : 0, 0, 2000, false, guard((v, user) => {
      if (!user) return; S.gift.generateDistance = v; const g = core.obj("GGen"); if (!g) return setStatus("level generator not running yet");
      core.set("GGen", g, "generateDistance", v); setStatus("generateDistance = " + v);
    }), 5, 0);
    const genCard = el("div", { className: "card" }, [
      rowOf("Gift chunk", "giftChunk (try 1)", giftCtl.wrap),
      rowOf("View distance", "generateDistance", distCtl.wrap)
    ]);

    // structures (level pieces): pick which ones can spawn
    let structs = [];
    const structList = el("div", { className: "tbl" });
    const structInfo = rowOf("Structures", "load to list level pieces", el("div"));
    const structFilter = el("input", { type: "text", placeholder: "filter by name (jump, tree...)", className: "sel" });
    structFilter.oninput = () => drawStructs();
    const drawStructs = () => {
      structList.innerHTML = "";
      if (!structs.length) { structList.appendChild(el("div", { className: "empty", textContent: "none loaded" })); return; }
      const q = structFilter.value.trim().toLowerCase();
      structs.forEach((a) => {
        const name = core.get("StructData", a, "name") || hex(a);
        if (q && name.toLowerCase().indexOf(q) < 0) return;
        const lo = core.get("StructData", a, "minScoreToSpawn"), hi = core.get("StructData", a, "maxScoreToSpawn");
        const nm = el("div", { className: "nm", title: hex(a) }, [text(name), el("i", { textContent: lo + "–" + hi })]);
        const prob = el("input", { type: "text", value: String(Math.round(core.get("StructData", a, "probability") * 1000) / 1000) });
        prob.onchange = guard(() => { const v = parseFloat(prob.value); if (isFinite(v)) { core.stash("StructData", a, "probability"); core.set("StructData", a, "probability", v); setStatus(name + " probability = " + v); } });
        const only = el("button", { className: "go", textContent: "★", title: "only this one" });
        only.onclick = guard(() => {
          structs.forEach((b) => { core.stash("StructData", b, "probability"); core.set("StructData", b, "probability", b === a ? 1000 : 0); });
          core.stash("StructData", a, "minScoreToSpawn"); core.stash("StructData", a, "maxScoreToSpawn");
          core.set("StructData", a, "minScoreToSpawn", 0); core.set("StructData", a, "maxScoreToSpawn", 99999999);
          drawStructs(); setStatus("only " + name + " can spawn now");
        });
        structList.appendChild(el("div", { className: "tr" }, [nm, prob, only]));
      });
    };
    const loadStructs = () => core.findAsync("StructData", guard((list, err) => {
      if (err) return setStatus(err.message);
      structs = list; subOf(structInfo).textContent = list.length + " found"; drawStructs();
      setStatus(list.length + " structures - ★ forces one, or edit probabilities");
    }), (p) => setStatus("scanning " + Math.round(p * 100) + "%"));
    const structCard = el("div", { className: "card" }, [structInfo]);
    structCard.appendChild(el("div", { className: "btns" }, [
      btn("Load", loadStructs),
      btn("Reset all", () => {
        structs.forEach((a) => { ["probability", "minScoreToSpawn", "maxScoreToSpawn"].forEach((f) => core.unstash("StructData", a, f)); });
        drawStructs(); setStatus("structures reset");
      })
    ]));
    structCard.appendChild(el("div", { style: "height:9px" }));
    structCard.appendChild(structFilter);
    structCard.appendChild(structList);
    page0.appendChild(sbCard);
    const page1 = el("div", { className: "pg hide" }, [structCard, genCard]);

    // =========================================================
    // TAB 3: INSPECTOR (any class, any field)
    // =========================================================
    const inspState = { cls: "PlayerControl", addr: 0, list: [] };
    const clsSel = el("select", { className: "sel" });
    Object.keys(core.FIELDS).sort().forEach((c) => clsSel.appendChild(el("option", { value: c, textContent: c })));
    clsSel.value = inspState.cls;
    const instSel = el("select", { className: "sel" });
    const inspTable = el("div", { className: "tbl" });
    let inspRows = [];
    const fmt = (r) => {
      const v = r.value, c = r.type[0];
      if (v === null || v === undefined) return "-";
      if (c === "f" || c === "d") return String(Math.round(v * 100000) / 100000);
      if (c === "p") return v ? hex(v) : "null";
      if (c === "s") return v === null ? "null" : v;
      if (c === "t") return "struct";
      return String(v);
    };
    const drawInsp = () => {
      inspTable.innerHTML = ""; inspRows = [];
      let rows;
      try { rows = core.rows(inspState.cls, inspState.addr); } catch (e) { inspTable.appendChild(el("div", { className: "empty", textContent: e.message })); return; }
      rows.forEach((r) => {
        const c = r.type[0], editable = "fdbihl".indexOf(c) >= 0 && r.base;
        const nm = el("div", { className: "nm", title: r.type + " @" + r.off }, [text(r.name), el("i", { textContent: (r.stat ? "static " : "") + r.type.split(":")[0] + (r.type.indexOf(":") > 0 ? ":" + r.type.split(":")[1] : "") })]);
        const inp = el("input", { type: "text", value: fmt(r), readOnly: !editable, spellcheck: false });
        inp.onchange = guard(() => {
          const t = inp.value.trim().toLowerCase();
          let x;
          if (c === "b") x = (t === "true" || t === "1");
          else { x = parseFloat(t); if (!isFinite(x)) { inp.value = fmt(r); return; } if ("ihl".indexOf(c) >= 0) x = Math.trunc(x); }
          core.wr(r.type, r.base + r.off, x);
          setStatus(inspState.cls + "." + r.name + " = " + x);
        });
        inp.onkeydown = (e) => { if (e.key === "Enter") inp.blur(); };
        const kids = [nm, inp];
        const target = r.type.split(":")[1];
        if (c === "p" && target && core.FIELDS[target] && r.value) {
          const go = el("button", { className: "go", textContent: "→", title: "open " + target });
          go.onclick = () => { inspState.cls = target; clsSel.value = target; inspState.addr = r.value; instSel.innerHTML = ""; instSel.appendChild(el("option", { value: r.value, textContent: hex(r.value) })); drawInsp(); };
          kids.push(go);
        }
        inspTable.appendChild(el("div", { className: "tr" }, kids));
        inspRows.push({ r, inp });
      });
    };
    const useInstance = (a) => { inspState.addr = a; drawInsp(); };
    const fillInst = (list) => {
      instSel.innerHTML = "";
      list.forEach((a) => instSel.appendChild(el("option", { value: a, textContent: hex(a) })));
      if (!list.length) instSel.appendChild(el("option", { value: 0, textContent: "(no instances)" }));
      inspState.addr = list[0] || 0; drawInsp();
    };
    clsSel.onchange = () => { inspState.cls = clsSel.value; inspState.addr = 0; fillInst([]); try { const o = core.obj(inspState.cls); if (o) fillInst([o]); } catch (e) {} };
    instSel.onchange = () => useInstance(+instSel.value);
    const findBtn = btn("Find", () => {
      setStatus("scanning...");
      core.findAsync(inspState.cls, guard((list, err) => {
        if (err) return setStatus(err.message);
        fillInst(list); setStatus(list.length + " " + inspState.cls + " instance(s)");
      }), (p) => setStatus("scanning " + Math.round(p * 100) + "%"));
    });
    const liveBtn = btn("Refresh", () => drawInsp());
    const page2 = el("div", { className: "pg hide" }, [
      el("div", { className: "card" }, [clsSel, el("div", { style: "height:8px" }), instSel,
        el("div", { className: "btns" }, [findBtn, liveBtn]), inspTable])
    ]);

    // ===== tab bar =====
    const tabNames = ["Game", "Chunks", "Inspector"];
    const tabEls = tabNames.map((n, i) => { const t = el("div", { className: "tab", textContent: n }); t.onclick = () => setTab(i); return t; });
    const tabs = el("div", { className: "tabs" }, [el("div", { className: "ind" }), ...tabEls]);
    const pages = [page0, page1, page2];
    const setTab = (i) => {
      S.tab = i;
      tabs.classList.toggle("t1", i === 1); tabs.classList.toggle("t2", i === 2);
      tabEls.forEach((t, j) => t.classList.toggle("on", j === i));
      pages.forEach((p, j) => p.classList.toggle("hide", j !== i));
      if (i === 2 && !inspRows.length) clsSel.onchange();
      if (i === 1 && !structs.length) loadStructs();
      setTimeout(() => reclamp(true), 300);
    };

    const body = el("div", { className: "b" }, [tabs, page0, page1, page2, status]);
    const panel = el("div", { className: "p" }, [head, body]);
    root.appendChild(el("style", { textContent: css }));
    root.appendChild(mkSvg());
    root.appendChild(panel);
    document.body.appendChild(mkSvg());
    document.body.appendChild(host);

    // keep the glass refraction map matched to the panel size
    let lastW = 0, lastH = 0, tm;
    const updateMap = () => {
      const w = panel.offsetWidth, h = panel.offsetHeight;
      if (!w || !h || (w === lastW && h === lastH)) return;
      lastW = w; lastH = h;
      let url; try { url = makeMap(w, h, 34, 28); } catch (e) { return; }
      svgs.forEach((s) => {
        const f = s.querySelector("filter"), im = s.querySelector("feImage");
        f.setAttribute("width", w); f.setAttribute("height", h);
        im.setAttribute("width", w); im.setAttribute("height", h);
        im.setAttribute("href", url);
        im.setAttributeNS("http://www.w3.org/1999/xlink", "href", url);
      });
    };
    updateMap();
    if (window.ResizeObserver) new ResizeObserver(() => { clearTimeout(tm); tm = setTimeout(updateMap, 120); }).observe(panel);

    panel.addEventListener("pointermove", (e) => {
      const r = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", (e.clientX - r.left) + "px");
      panel.style.setProperty("--my", (e.clientY - r.top) + "px");
    });

    // ---- position + edge clamping ----
    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    const bounds = () => ({ maxL: Math.max(0, innerWidth - host.offsetWidth), maxT: Math.max(0, innerHeight - host.offsetHeight) });
    const reclamp = (animated) => {
      const b = bounds();
      const cl = clamp(host.offsetLeft, 0, b.maxL), ct = clamp(host.offsetTop, 0, b.maxT);
      if (cl === host.offsetLeft && ct === host.offsetTop) return;
            host.style.left = cl + "px"; host.style.top = ct + "px";
    };
    if (saved.pos) { host.style.left = saved.pos.l + "px"; host.style.top = saved.pos.t + "px"; }
    if (saved.min) body.classList.add("hide");
    reclamp(false);
    addEventListener("resize", () => reclamp(false));

    // ---- dragging: follows the pointer directly ----
    let dragging = false, offX = 0, offY = 0;
    head.addEventListener("pointerdown", (e) => {
      if (e.target === minBtn) return;
      dragging = true; offX = e.clientX - host.offsetLeft; offY = e.clientY - host.offsetTop;
      head.setPointerCapture(e.pointerId);
    });
    head.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const b = bounds();
      host.style.left = clamp(e.clientX - offX, 0, b.maxL) + "px";
      host.style.top = clamp(e.clientY - offY, 0, b.maxT) + "px";
    });
    const release = () => { dragging = false; };
    head.addEventListener("pointerup", release);
    head.addEventListener("pointercancel", release);
    minBtn.onclick = () => body.classList.toggle("hide");

    // ================= live loops =================
    // speed / jump: scale the current sled's SledgeData, remembering the originals
    let tuned = false;
    setInterval(() => {
      try {
        if (S.spd === 1 && S.jmp === 1 && !tuned) return;
        const p = core.obj("PlayerControl");
        if (!p) return;
        const d = core.get("PlayerControl", p, "data");
        if (!core.okPtr(d)) return;
        core.tune("SledgeData", d, { baseMoveSpeed: S.spd, speedAcceleration: S.spd, jumpSpeed: S.jmp });
        tuned = S.spd !== 1 || S.jmp !== 1;
      } catch (e) {}
    }, 600);

    // invincible: flip "end" back to "play"; pauses itself if the crash repeats every frame
    let blocks = [], coolUntil = 0;
    setInterval(() => {
      if (!S.inv) return;
      try {
        const now = performance.now(); if (now < coolUntil) return;
        const gm = core.statics("GameControl") + 40;
        if (core.rd("i", gm) === 3) {
          core.wr("i", gm, 2);
          blocks = blocks.filter((t) => now - t < 1000); blocks.push(now);
          if (blocks.length > 20) { coolUntil = now + 3000; blocks = []; setStatus("crash repeats every frame - invincible paused 3s"); }
        }
      } catch (e) {}
    }, 16);

    // keep the number boxes in step with the game (only while they're visible and not being typed in)
    setInterval(() => {
      if (body.classList.contains("hide")) return;
      try {
        if (S.tab === 0) {
          run.sync(core.sget("GameControl", "giftsThisGame"));
          score.sync(core.sget("GameControl", "score"));
          const a = core.giftSlot(); if (a) total.sync(core.rd("i", a));
        } else if (S.tab === 1) {
          const g = core.obj("GGen");
          if (g) { if (S.gift.giftChunk === undefined) giftCtl.sync(core.get("GGen", g, "giftChunk")); if (S.gift.generateDistance === undefined) distCtl.sync(core.get("GGen", g, "generateDistance")); }
        } else if (S.tab === 2) {
          inspRows.forEach(({ r, inp }) => {
            if (root.activeElement === inp || !r.base) return;
            const v = core.rd(r.type, r.base + r.off);
            const t = fmt({ value: v, type: r.type });
            if (inp.value !== t) inp.value = t;
          });
        }
      } catch (e) {}
    }, 700);

    setTab(S.tab >= 0 && S.tab <= 2 ? S.tab : 0);
    if (S.auto) autoLoop();

    // ================= autosave every 2 seconds =================
    let lastJson = JSON.stringify(saved);
    setInterval(() => {
      try {
        const data = { tab: S.tab, spd: S.spd, jmp: S.jmp, auto: S.auto, sb: S.sb, gift: S.gift, inv: S.inv,
          pos: { l: host.offsetLeft, t: host.offsetTop }, min: body.classList.contains("hide") };
        const json = JSON.stringify(data);
        if (json === lastJson) return;
        localStorage.setItem(KEY, json);
        lastJson = json;
        dot.classList.add("on");
        setTimeout(() => dot.classList.remove("on"), 350);
      } catch (e) {}
    }, 2000);

    console.log("Snow Rider menu loaded. Console tools: snow.obj('PlayerControl'), snow.find(cls), snow.rows(cls, addr)");
  }
})();