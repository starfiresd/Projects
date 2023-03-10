USE [Hasty]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Select_ById]    Script Date: 03/07/23 13:12:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Doupis>
-- Create date: <01-25-2023T17:15:00>
-- Description: Messages Select ById
-- Code Reviewer:Mariana Hernandez

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC[dbo].[Messages_Select_ById]
		@Id int

/*---Test Code---

	DECLARE @Id int = 8

	EXECUTE [dbo].[Messages_Select_ById]
		@Id

*/

AS

BEGIN
	
	SELECT m.Id
		,m.Message
		,m.Subject
		,m.RecipientId
		,m.SenderId
		,m.DateSent
		,m.DateRead
		,m.DateModified
		,m.DateCreated

	FROM [dbo].[Messages] as m
	WHERE m.Id = @Id

END
GO
