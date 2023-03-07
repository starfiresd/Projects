USE [Hasty]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_ByRecipientId_Pagination]    Script Date: 03/07/23 13:12:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Doupis>
-- Create date: <01-25-2023T17:15:00>
-- Description: Messages Select ByRecipientId Pagination
-- Code Reviewer: Mariana Hernandez

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC[dbo].[Messages_Select_ByRecipientId_Pagination]
		@RecipientId int
		,@PageIndex int
		,@PageSize int

/*---Test Code---

	DECLARE @RecipientId int = 3
		,@PageIndex int = 0
		,@PageSize int = 5

	EXECUTE [dbo].[Messages_Select_ByRecipientId_Pagination]
		@RecipientId
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
	WHERE m.RecipientId = @RecipientId
	ORDER BY m.Id

	OFFSET @Offset ROWS
	FETCH NEXT @PageSize ROWS ONLY

END
GO
