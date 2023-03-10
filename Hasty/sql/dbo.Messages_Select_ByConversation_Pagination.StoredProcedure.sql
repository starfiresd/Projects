USE [Hasty]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_ByConversation_Pagination]    Script Date: 03/07/23 13:12:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: <Doupis>
-- Create date: <01-25-2023T17:15:00>
-- Description: Messages Select ByConversation Pagination
-- Code Reviewer:

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC[dbo].[Messages_Select_ByConversation_Pagination]
		@SenderId int
		,@RecipientId int
		,@PageIndex int
		,@PageSize int

/*---Test Code---

	DECLARE @SenderId int = 57
		,@RecipientId int = 58
		,@PageIndex int = 0
		,@PageSize int = 50

	EXECUTE [dbo].[Messages_Select_ByConversation_Pagination]
		@SenderId
		,@RecipientId
		,@PageIndex
		,@PageSize
	
*/

AS

BEGIN

	DECLARE @Offset int = @PageIndex * @PageSize
	
	SELECT m.Id
		,m.Message
		,m.Subject
		,m.RecipientId
		,m.SenderId
		,m.DateSent
		,m.DateRead
		,m.DateModified
		,m.DateCreated
		,TotalCount = COUNT(1) OVER()

	FROM [dbo].[Messages] as m
	WHERE ((m.SenderId = @SenderId AND m.RecipientId = @RecipientId) OR (m.SenderId = @RecipientId AND m.RecipientId = @SenderId)) AND m.DateSent IS NOT NULL
	ORDER BY m.DateSent ASC 

	OFFSET @Offset ROWS
	FETCH NEXT @PageSize ROWS ONLY

END
GO
