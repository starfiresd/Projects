USE [Hasty]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_ByUserId_RecentConversations]    Script Date: 03/07/23 13:12:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Doupis>
-- Create date: <01-25-2023T17:15:00>
-- Description: Messages Select ByUserId RecentConversations
-- Code Reviewer:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC[dbo].[Messages_Select_ByUserId_RecentConversations]
		@UserId int

/*---Test Code---

	DECLARE @UserId int = 57

	EXECUTE [dbo].[Messages_Select_ByUserId_RecentConversations]
		@UserId
	
*/

AS

BEGIN

	SELECT m.Id
		,m.Message as MessageText
		,m.Subject
		,m.RecipientId
		,m.SenderId
		,m.DateSent
		,m.DateRead
		,m.DateModified
		,m.DateCreated

	FROM [dbo].[Messages] as m
	WHERE (m.RecipientId = @UserId OR m.SenderId = @UserId)
			AND (m.DateSent <= GETUTCDATE() AND m.DateSent >= DATEADD(day,-30,GETUTCDATE()))
	ORDER BY m.DateSent ASC

END
GO
